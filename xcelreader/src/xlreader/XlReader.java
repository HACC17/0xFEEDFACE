package xlreader;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.stream.JsonReader;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

/**
 * This class represents a set of excel documents.
 *
 * So, basically it's a bunch of sheets. Each sheet
 * has some rows and columns. A row and a column
 * specify a cell. Cells contain different types
 * of data: numbers, formula, strings, etc...
 *
 * An XlReader is constructed with a filename.
 */
public class XlReader {
    private final String filename;
    private final Workbook workbook;
    private final ArrayList<Sheet> sheets;
    private final int nsheets;

    public class sheetarray {
        String sheet;
    }

    public XlReader(final String filename) throws IOException {
        this.filename = filename;
        this.workbook = makeWorkBooks();
        this.sheets   = makeSheets();
        this.nsheets  = this.workbook.getNumberOfSheets();
    }

    /**
     * Return an ArrayList of sheets.
     */
    private ArrayList<Sheet> makeSheets() {
        ArrayList<Sheet> sheets = new ArrayList<>();

        /* This is weird and cool checkout Java method references. */
        this.workbook.forEach(sheets::add);
        return sheets;
    }

    /**
     * Open an excel file and return a Workbook.
     *
     * @return                  an apache.poi.ss.Workbook
     * @throws  IOException     if the file doesn't exist or something like that
     */
    private Workbook makeWorkBooks() throws IOException {
        FileInputStream fin = null;

        /* Try to open the file. If this fails exit with an error code of 1.*/
        try {
            fin = new FileInputStream(this.filename);
        } catch(Exception e) {
            e.printStackTrace();
            System.exit(1);
        }
        Workbook wb = null;

        try {
            String ext = filename.substring(filename.indexOf("."));

            if (ext.equals(".xls")) {
                wb = new HSSFWorkbook(fin);
            }
            else if (ext.equals(".xlsx")) {
                wb = new XSSFWorkbook(fin);
            }
            else {
                System.out.println("Unsupported file type.");
                System.exit(1);
            }
        }
        catch(Exception e) {
            e.printStackTrace();
            System.out.println(e);
        }
        finally {
            if (fin != null) {
                fin.close();
            }
        }
        return wb;
    }

    /**
     * Find all of the formula in this workbook.
     */
    private HashMap<String, String> findAllFormulae() {
        HashMap<String, String> formulae = new HashMap<>();

        for (Sheet sheet : this.workbook) {
            for (Row row : sheet) {
                for (Cell cell : row) {
                    if (cell.getCellTypeEnum() == CellType.FORMULA) {
                        formulae.put(cell.getAddress().toString(), cell.getCellFormula());
                    }
                }
            }
        }
        return formulae;
    }


    /**
     * Evaluate a formula in a cell.
     *
     * @param   sheetnumber
     * @param   cellreference
     */
    public void evaluateFormula(final int sheetnumber, final String cellreference) {
        if (sheetnumber > this.nsheets) {
            System.exit(1);
        }
        FormulaEvaluator evaluator = this.workbook.getCreationHelper().createFormulaEvaluator();
        CellReference cellref = new CellReference(cellreference);
        Sheet sheet = this.workbook.getSheetAt(sheetnumber);
        Row row = sheet.getRow(cellref.getRow());
        Cell cell = row.getCell(cellref.getCol());

        CellValue val = evaluator.evaluate(cell);
    }

    /**
     * Evaluate all the cells in a Sheet.
     *
     * The caller is responsible for knowing where the result goes. It will probably be
     * a sheet somewhere.
     *
     * Note: this changes our world!
     *
     * @param   sheetnumber     the number of the sheet to get
     * @return  evaluator       a FormulaEvaluator that is used when writing PDFs
     */
    public FormulaEvaluator evaluateAll(final int sheetnumber) throws FileNotFoundException, DocumentException {
        //if (this.evaluated = true) { return; }
        if (sheetnumber > this.nsheets) {
            System.exit(1);
        }

        FormulaEvaluator evaluator = this.workbook.getCreationHelper().createFormulaEvaluator();
        evaluator.evaluateAll();
        try {
            this.toPdf("evalall.pdf", sheetnumber, 5, evaluator);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (DocumentException e) {
            e.printStackTrace();
        } catch (IOException e) {

        }
        return evaluator;
    }

    /**
     * @return  the number of sheets in this workbook
     */
    public int getNsheets() {
        return this.nsheets;
    }

    /**
     * Get the value from a cell.
     *
     * Returns a map with {cell reference : value}.
     *
     * Note: Not all cells will have a value. If the cell is blank or doesn't exist
     *       then the resulting map will have a null value. It is the caller's
     *       responsibility to check for null.
     *
     * @param   sheetnumber      an integer
     * @param   cellreferences   a string like "A3"
     * @return  map              a hash map like {cellreference : value | null}
     */
    public HashMap<String, Object> getCellValue(final int sheetnumber, final String[] cellreferences) {

        final HashMap<String, Object> map = new HashMap<>();
        final Sheet sheet = this.workbook.getSheetAt(sheetnumber);

        for (String cr : cellreferences) {
            CellReference cellref = new CellReference(cr);
            Row row = sheet.getRow(cellref.getRow());
            Cell cell = row.getCell(cellref.getCol());
            String addr = cell.getAddress().toString();

            switch (cell.getCellTypeEnum()) {
                case FORMULA:
                    map.put(addr, cell.getNumericCellValue());
                    break;
                case BLANK:
                    map.put(addr, cell.getRichStringCellValue());
                    break;
                case STRING:
                    map.put(addr, cell.getStringCellValue());
                    break;
                case BOOLEAN:
                    map.put(addr, cell.getBooleanCellValue());
                    break;
                case NUMERIC:
                    map.put(addr, cell.getNumericCellValue());
                    break;
                case ERROR:
                    map.put(addr, cell.getErrorCellValue());
                    break;
                case _NONE:
                    map.put(addr, cell.getRichStringCellValue());
                    break;
            }
        }
        return map;
    }

    /**
     * Given a map of {cell : value} populate each cell with the value.
     *
     * @param   sheetnumber     the number of the sheet in the workbook
     * @param   map             a map containing {cell : value} pairs
     * @return                  true if population is successful
     */
    public Boolean populate(final int sheetnumber, HashMap<String, Object> map) {

        Boolean success = false;

        Sheet sheet = this.workbook.getSheetAt(sheetnumber);

        for (HashMap.Entry<String, Object> item : map.entrySet()) {
            CellReference ref = new CellReference(item.getKey());
            Row row = sheet.getRow(ref.getRow());
            Cell cell = row.getCell(ref.getCol());

            switch (cell.getCellTypeEnum()) {
                case FORMULA:
                    cell.setCellFormula(item.getValue().toString());
                    success = true;
                    break;
                case BLANK:
                    break;
                case STRING:
                    cell.setCellValue((String) item.getValue());
                    success = true;
                    break;
                case BOOLEAN:
                    cell.setCellValue((Boolean) item.getValue());
                    success = true;
                    break;
                case NUMERIC:
                    cell.setCellValue((Double) item.getValue());
                    success = true;
                    break;
                case ERROR:
                    break;
                case _NONE:
                    break;
            }
        }
        return success;
    }

    /**
     * Write the entire excel file to a new excel file.
     *
     * This is intended to be run after the original excel file has been
     * evaluated using evaluateAll.
     *
     * @param   filename        the name of the new file
     * @throws  IOException     if the file can't be created
     */
    public void writeXlsx(String filename) throws IOException {
        FileOutputStream file = new FileOutputStream(filename);
        this.workbook.write(file);
        file.close();
    }

    private void toPdf(String filename, int sheetnumber, int ncols, FormulaEvaluator evaluator) throws IOException, DocumentException {
        this.workbook.write(new FileOutputStream("output.pdf"));
    }

    /**
     * Make a PDF table given rows and columns.
     *
     * @param   ncols   the number of columns in the table
     * @param   nrows   the number of rows in the table
     */
    private void makePDFTable(final int ncols, final int nrows) {
        PdfPTable table = new PdfPTable(ncols);
        // Make the table header.
        for (int i = 0; i < ncols; ++i) {
            PdfPCell cell = new PdfPCell(new Phrase("haeder" + i));
            table.addCell(cell);
        }
        // Add the labels. They need to span 5 rows.
        PdfPCell cell = new PdfPCell(new Phrase("label"));
    }
    /***************************************************************
     * Here begin the tests. They shouldn't be here, but they are. *
     ***************************************************************/
    private void testGetAllFormulae() {
        System.out.println("Testing getAllFormulae");

        /* Do the thing. */
        HashMap<String, String> formulae = findAllFormulae();

        formulae.forEach((k,v) -> System.out.format("key: %s   value: %s\n", k, v));

        //assert formulae.get("A3").equals("0");
        //assert formulae.get("B3").equals("SUM(B1:B2)");
    }

    private void testPopulate() {
        System.out.println("Testing populate");

        /* Make a map to populate the cells. */
        HashMap<String, Object> map = new HashMap<>();
        map.put("A1", "hello");
        map.put("A2", 42.0);
        map.put("A3", true);

        /* Do the thing. */
        assert populate(0, map) == true : "FAILED: populate";

        /* This is where we expect values. */
        String[] cellrefs = {"A1", "A2", "A3"};
        HashMap<String, Object> cells = this.getCellValue(0, cellrefs);

        assert cells.get("A1").equals("hello") : "FAILED: A1 is not hello";
        assert (Double) cells.get("A2") == 42.0 : "FAILED: A2 is not 42.0";
        assert (Double) cells.get("A3") == 0.0 : "FAILED: A3 is false";
    }

    public void testEvaluateAll() {
        System.out.println("Testing evaluateAll");

        /* Do the thing. */
        //this.evaluateAll(0);

        /* This is where we expect values. */
        String[] cellrefs = {"B1", "B2", "B3"};

        HashMap<String, Object> cells = this.getCellValue(0, cellrefs);

        assert (Double) cells.get("B1") == 19.0;
        assert (Double) cells.get("B2") == 23.0;
        assert (Double) cells.get("B3") == 42.0;
    }

    private void populateXl(final String data) throws IOException {
        Gson g = new Gson();
        JsonReader jsonReader = new JsonReader(new StringReader(data));
        jsonReader.setLenient(true);
        Map<String, Object> result = g.fromJson(jsonReader, Map.class);

        result.forEach((k, v) -> {
            System.out.format("Key: %s, Value: %s", k, v);
        });



        //Map<String, Object> map = g.fromJson(data.replaceAll("\\s+", ""), Map.class);

        //map.forEach((k, v)-> {
        //    System.out.format("Key: %s, Value: %s\n", k, v);
        //});
        //map.forEach((k, v) -> {
            //Gson json = new Gson();
            //Map<String, Object> cells = json.fromJson(v.toString(), Map.class);

            //cells.forEach((kk, vv) -> {
            //});
        //});

    }


    public static void main(String[] args) throws IOException, DocumentException {

    //    /* Check the command line arguments. */
        if (args.length != 1) { System.exit(2); }


        String data = args[0];

        String master = "excel_files/eal_surfer_master.xlsx";
        XlReader xlreader = new XlReader(master);
        xlreader.populateXl(data);

        //xlreader.evaluateAll(4);
        //xlreader.writeXlsx("new.xlsx");

        // Evaluate the data.
        //FormulaEvaluator evaluator = xlreader.evaluateAll(2);

        // Write the results to xlsx.
        //xlreader.toXlsx("testing.xlsx");

        // Write the resulting xlsx to pdf.
        //xlreader.toPdf("testing.pdf", 4, 5, evaluator);

        //xlreader.testGetAllFormulae();
        //xlreader.testPopulate();
        //xlreader.testEvaluateAll();
    }
}
