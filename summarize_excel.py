import pandas as pd
import openpyxl

def summarize_excel(file_path, output_path):
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(f"--- Summarizing {file_path} ---\n")
        xl = pd.ExcelFile(file_path)
        f.write(f"Sheets: {xl.sheet_names}\n")
        for sheet_name in xl.sheet_names:
            f.write(f"\n--- Sheet: {sheet_name} ---\n")
            df = xl.parse(sheet_name)
            f.write(str(df.head(20)) + "\n")
            # f.write(str(df.info()) + "\n") # df.info() prints to stdout, need to capture it if needed

if __name__ == "__main__":
    summarize_excel("Simulatorv2 (1).xlsm", "excel_summary_1.txt")
    summarize_excel("Simulatorv2 (2).xlsm", "excel_summary_2.txt")
