package xlreader;

import java.io.*;
import java.util.ArrayList;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.internal.LinkedTreeMap;
import com.google.gson.stream.JsonReader;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

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
            String ext = "";
            int i = filename.lastIndexOf('.');
            if (i > 0) { ext = filename.substring(i+1); }

            if (ext.equals("xls")) {
                wb = new HSSFWorkbook(fin);
            }
            else if (ext.equals("xlsx")) {
                wb = new XSSFWorkbook(fin);
            }
            else {
                System.out.println(ext);
                System.out.println("Crap! Unsupported file type.");
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
     * Evaluate all the cells in a Sheet.
     *
     * The caller is responsible for knowing where the result goes. It will probably be
     * a sheet somewhere.
     *
     * Note: this changes our world!
     *
     * @return  evaluator       a FormulaEvaluator that is used when writing PDFs
     */
    public Boolean evaluateAll() throws FileNotFoundException {
        Boolean success = false;
        FormulaEvaluator evaluator = this.workbook.getCreationHelper().createFormulaEvaluator();
        try {
            //XSSFFormulaEvaluator.evaluateAllFormulaCells(this.workbook);
            evaluator.evaluateAll();
            success = true;
        } catch (Exception e) {
            success = false;
        }
        return success;
    }

    /**
     * Populate a cell from the nth sheet.
     *
     * @param n         the sheet number
     * @param celref    the cell reference e.g. "B9"
     * @param val       the value to populate the cell with
     * @return          true if everything worked
     */
    private Boolean populate(int n, Object celref, Object val) {

            Boolean success = false;
            Sheet sheet = this.workbook.getSheetAt(n);
            CellReference ref = new CellReference(celref.toString());
            Row row = sheet.getRow(ref.getRow());
            Cell cell = row.getCell(ref.getCol());

            switch (cell.getCellTypeEnum()) {
                case FORMULA:
                    cell.setCellFormula(val.toString());
                    success = true;
                    break;
                case BLANK:
                    cell.setCellValue(val.toString());
                    success = true;
                    break;
                case STRING:
                    cell.setCellValue(val.toString());
                    success = true;
                    break;
                case BOOLEAN:
                    cell.setCellValue(Boolean.parseBoolean(val.toString()));
                    success = true;
                    break;
                case NUMERIC:
                    if (val.toString().equals("")) {
                        break;
                    }
                    cell.setCellValue(Double.parseDouble(val.toString()));
                    success = true;
                    break;
                case ERROR:
                    success = false;
                    break;
                case _NONE:
                    cell.setCellValue(val.toString());
                    success = true;
                    break;
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
    public Boolean writeXlsx(String filename) throws IOException {
        Boolean success = true;
        FileOutputStream file = null;
        XSSFWorkbook wb = (XSSFWorkbook) this.workbook;

        try {
            file = new FileOutputStream(filename);
        } catch (FileNotFoundException e) {
            success = false;
            e.printStackTrace();
        }
        try {
            // Have to remove in reverse order so we don't change the state
            // of the workbook for future loops.
            for (int i = wb.getNumberOfSheets()-1; i >= 0; --i) {
                if (false) {
                    wb.removeSheetAt(i);
                }
            }
            wb.write(file);
        } catch (IOException e) {
            success = false;
            e.printStackTrace();
        }
        file.close();
        return success;
    }

    /**
     * This returns a map like {sheetnumber: {cell:data}}
     * @param json
     * @return
     */
    private ArrayList<Map<String, LinkedTreeMap>> json2Map(final String json) {
        Gson g = new Gson();
        JsonReader reader = new JsonReader(new StringReader(json));
        reader.setLenient(true);

        // Convert it.
        ArrayList<Map<String, LinkedTreeMap>> result = g.fromJson(reader, ArrayList.class);
        return result;
    }

    /**
     * Loop through all the data from the site, fill out all the forms, and
     * finally write the new excel files.
     *
     * @param args  a json string like [{"sheet1": {cell:value},..., "sheetn":...}
     * @throws IOException
     */
    public static void main(String[] args) throws IOException {

        //    /* Check the command line arguments. */
        if (args.length != 1) {
            System.exit(2);
        }

        String data = args[0];

        String master = "../xcelreader/excel_files/eal_surfer_master.xlsx";
        String outputdir = "./public/clientxlsx/";
        XlReader xlreader = new XlReader(master);

        ArrayList<Map<String, LinkedTreeMap>> alldata = xlreader.json2Map(data);

        Boolean evaluatedworked = false;
        Boolean writeworked = false;
        final Boolean[] populateworked = {false};

        String name = new String();

        // Loop through all the workbooks in the data array.
        for (Map<String, LinkedTreeMap> chunk : alldata) {

            String chemicalname = new String();
            String sitename = new String();
            String sitedate = new String();

            // Loop through the data for each sheet.
            for (Map.Entry<String, LinkedTreeMap> entry : chunk.entrySet()) {

                String sheet = entry.getKey();
                LinkedTreeMap celldata = entry.getValue();

                // Get the name parts.
                if (sheet.equals("sheet2")) {
                    chemicalname = celldata.get("C16").toString();
                }
                if (sheet.equals("sheet4")) {
                    sitename = celldata.get("D4").toString().replaceAll(" ", "_");
                    sitedate = celldata.get("D9").toString().replaceAll(" ", "_");
                }

                // Populate all the data.
                celldata.forEach((cellref, cellval) -> {
                    int n = (int) Integer.parseInt(sheet.replaceAll("^sheet", ""));
                    populateworked[0] = xlreader.populate(n, cellref, cellval);
                }); // END loop through cell data.

                if (sheet.equals("sheet4")) {
                    // Construct the filename.
                    name = String.format("%s%s_%s_%s.xlsx", outputdir, sitename, chemicalname, sitedate);

                    // Evaluate the workbook.
                    try {
                        evaluatedworked = xlreader.evaluateAll();
                    } catch (FileNotFoundException e) {
                        e.printStackTrace();
                    }

                    // Write the results.
                    try {
                        writeworked = xlreader.writeXlsx(name);

                        // Make a copy and remove unwanted sheets.
                        XlReader reader1 = new XlReader(name);
                        int size = reader1.workbook.getNumberOfSheets() - 1;

                        for (int i = size; i >= 0; --i) {
                            if (i != 4 && i != 5) {
                                reader1.workbook.removeSheetAt(i);
                            }
                        }
                        reader1.writeXlsx(name);
                    } catch (IOException e) {
                        e.printStackTrace();
                        System.out.format("%d", 1);
                        System.exit(1);
                    }
                }
            } // END loop through chunks entrys
        } // END loop through chunks

        // Check the status. And we're done.
        if (populateworked[0] && evaluatedworked && writeworked) {
            System.out.println(0);
            System.exit(0);
        } else {
            System.exit(1);
        }
    }
}
