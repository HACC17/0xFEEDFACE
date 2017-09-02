package xlreader;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.stream.IntStream;

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
    private String filename;
    private Workbook workbook;
    private Sheet currentsheet;
    private HashMap<Integer, Sheet> sheets;
    private int nsheets;

    public XlReader(final String filename) throws IOException {
        this.filename = filename;
        this.workbook = makeWorkBooks();
        this.sheets = getSheets();
        this.nsheets = workbook.getNumberOfSheets();
    }

    private HashMap<Integer, Sheet> getSheets() {
        HashMap<Integer, Sheet> hashmap = new HashMap<>();
        IntStream.range(0, nsheets)
                .forEach(idx -> hashmap.put(idx, this.workbook.getSheetAt(idx)));

        return hashmap;
    }

    private Workbook makeWorkBooks() throws IOException {
        FileInputStream fin = null;

        /* Try to open the file. If this fails exit with an error code of 1.*/
        try {
            fin = new FileInputStream(this.filename);
        } catch(Exception e) {
            e.printStackTrace();

            /* Can't do anything without a file. */
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

        } catch(Exception e) {
            e.printStackTrace();
            System.out.println(e);
        } finally {
            if (fin != null) {
                fin.close();
            }
        }
        return wb;
    }

    private void findAllFormulae() {
        for (Sheet sheet : this.workbook) {
            for (Row row : sheet) {
                for (Cell cell : row) {
                    if (cell.getCellTypeEnum() == CellType.FORMULA) {
                        System.out.format("Found a formula at %s\n", cell.getAddress());
                        System.out.format("Formula: %s", cell.getCellFormula());
                    }
                }
            }

        }
    }

    public void evaluateFormulae(final int sheetnumber, final String cellreference) {
        FormulaEvaluator evaluator = this.workbook.getCreationHelper().createFormulaEvaluator();
        CellReference cellref = new CellReference(cellreference);
        Sheet sheet = this.workbook.getSheetAt(sheetnumber);
        Row row = sheet.getRow(cellref.getRow());
        Cell cell = row.getCell(cellref.getCol());

        CellValue val = evaluator.evaluate(cell);
    }

    public int getNsheets() {
        return this.nsheets;
    }


    public static void main(String[] args) throws IOException {

        /* Check the command line arguments. */
        if (args.length != 1) {
            System.out.format("args length %s", args.length);
            System.out.println("usage: java Main [excel filename]");
            System.exit(2);
        }

        String filename = args[0];
        File file = new File(filename);

        XlReader xlreader = new XlReader(filename);

        System.out.format("nsheets: %d\n", xlreader.getNsheets());

        xlreader.findAllFormulae();
        xlreader.evaluateFormulae(0, "A3");

        //Row row = sheet.getRow(3);
        //Cell cell = row.getCell("A");

        //CellValue val = evaluator.evaluate(cell);

        /*
        switch (val.getCellType()) {
            case Cell.CELL_TYPE_BOOLEAN:
                System.out.println(val.getBooleanValue());
                break;
            case Cell.CELL_TYPE_NUMERIC:
                System.out.println(val.getNumberValue());
                break;
            case Cell.CELL_TYPE_BLANK:
                break;
            case Cell.CELL_TYPE_ERROR:
                break;
            case Cell.CELL_TYPE_FORMULA:
                break;
        }
        */
    }
}
