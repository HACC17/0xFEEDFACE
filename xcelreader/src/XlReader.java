import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class XlReader {
    public static void main(String[] args) throws IOException {

        /* Check the command line arguments. */
        if (args.length != 1) {
            System.out.format("args length %s", args.length);
            System.out.println("usage: java Main [excel filename]");
            System.exit(2);
        }

        String filename = args[0];
        File file = new File(filename);

        FileInputStream fin = null;

        /* Try to open the file. If this fails exit with an error code of 1.*/
        try {
            fin = new FileInputStream(file);
        } catch(Exception e) {
            System.out.println(e);

            /* Can't do anything without a file. */
            System.exit(1);
        }

        /* Try to make a work book. If this fails print a message and
         * exit the program with an error code of 1. */
        try {
            /* Make a workbook. */
            Workbook wb = null;

            /* Find out what type of excel file this is.
             * This could be a problem if files have more
             * than one dot. But we can deal with that
             * if we come across it. */
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

            /* Get the first sheet. */
            Sheet sheet = wb.getSheetAt(0);

            /* Compute the number of rows. */
            int nrows = sheet.getLastRowNum() - sheet.getFirstRowNum();

            /* Loop over the all the rows and columns. */
            for (int i = 1; i < nrows; ++i) {
                Row row = sheet.getRow(i);
                System.out.println(i);

                for (int j = 0; j< row.getLastCellNum(); ++j) {
                    System.out.println(row.getCell(j).toString() + " ");
                }
            }
        } catch(Exception e) {
            e.printStackTrace();
            System.out.println(e);
        } finally {

            /* Make sure to close the stream. */
            if (fin != null) {
                fin.close();
            }
        }

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
