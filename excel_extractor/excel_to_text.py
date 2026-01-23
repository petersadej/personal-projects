import pandas as pd
import sys
from pathlib import Path


def excel_to_text(excel_file, output_file=None):
    """
    Convert an Excel file to a formatted text document.
    Each row is written on separate lines with column headers preceding the data.

    Args:
        excel_file: Path to the Excel file
        output_file: Path to the output text file (optional)
    """
    try:
        # Read the Excel file
        df = pd.read_excel(excel_file)

        # If no output file specified, create one based on input filename
        if output_file is None:
            output_file = Path(excel_file).stem + "_output.txt"

        # Open the output file for writing
        with open(output_file, 'w', encoding='utf-8') as f:
            # Get column headers
            headers = df.columns.tolist()

            # Process each row
            for index, row in df.iterrows():
                f.write(f"Row {index + 1}:\n")
                f.write("-" * 50 + "\n")

                # Write each column header with its corresponding value
                for header in headers:
                    value = row[header]
                    f.write(f"{header}: {value}\n")

                f.write("\n")  # Add blank line between rows

        print(f"Successfully converted {excel_file} to {output_file}")
        return output_file

    except FileNotFoundError:
        print(f"Error: File '{excel_file}' not found.")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python excel_to_text.py <excel_file> [output_file]")
        print("Example: python excel_to_text.py data.xlsx output.txt")
        sys.exit(1)

    excel_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None

    excel_to_text(excel_file, output_file)
