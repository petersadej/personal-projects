import pandas as pd
import sys
from pathlib import Path
from docx import Document
from docx.shared import Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH


def excel_to_word(excel_file, output_file=None):
    """
    Convert an Excel file to a formatted Word document.
    Each row is written with column headers in bold preceding the data.

    Args:
        excel_file: Path to the Excel file
        output_file: Path to the output Word file (optional)
    """
    try:
        # Read the Excel file
        df = pd.read_excel(excel_file)

        # If no output file specified, create one based on input filename
        if output_file is None:
            output_file = Path(excel_file).stem + "_output.docx"

        # Create a new Word document
        doc = Document()

        # Get column headers
        headers = df.columns.tolist()

        # Process each row
        for index, row in df.iterrows():
            # Add row header
            row_heading = doc.add_paragraph()
            run = row_heading.add_run(f"Row {index + 1}:")
            run.bold = True
            run.font.size = Pt(12)

            # Add separator
            doc.add_paragraph("_" * 50)

            # Write each column header with its corresponding value
            for header in headers:
                value = row[header]
                p = doc.add_paragraph()
                # Add header in bold
                header_run = p.add_run(f"{header}: ")
                header_run.bold = True
                # Add value in normal text
                value_run = p.add_run(str(value))

            # Add blank paragraph between rows
            doc.add_paragraph()

        # Save the document
        doc.save(output_file)

        print(f"Successfully converted {excel_file} to {output_file}")
        return output_file

    except FileNotFoundError:
        print(f"Error: File '{excel_file}' not found.")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


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
        print("Usage: python excel_to_text.py <excel_file> [output_file] [--format txt|docx]")
        print("Example: python excel_to_text.py data.xlsx output.txt")
        print("Example: python excel_to_text.py data.xlsx output.docx --format docx")
        sys.exit(1)

    excel_file = sys.argv[1]
    output_file = None
    output_format = 'txt'  # default format

    # Parse arguments
    for i, arg in enumerate(sys.argv[2:], start=2):
        if arg == '--format' and i + 1 < len(sys.argv):
            output_format = sys.argv[i + 1].lower()
        elif not arg.startswith('--') and arg not in ['txt', 'docx']:
            output_file = arg

    # Auto-detect format from output file extension if provided
    if output_file:
        ext = Path(output_file).suffix.lower()
        if ext == '.docx':
            output_format = 'docx'
        elif ext == '.txt':
            output_format = 'txt'

    # Convert based on format
    if output_format == 'docx':
        excel_to_word(excel_file, output_file)
    else:
        excel_to_text(excel_file, output_file)
