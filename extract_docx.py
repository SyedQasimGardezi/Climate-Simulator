import docx
import os

def extract_docx(file_path):
    doc = docx.Document(file_path)
    full_text = []
    for para in doc.paragraphs:
        full_text.append(para.text)
    return '\n'.join(full_text)

if __name__ == "__main__":
    file_path = "workinstruction (1).docx"
    output_path = "docx_content.txt"
    if os.path.exists(file_path):
        content = extract_docx(file_path)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Content written to {output_path}")
    else:
        print(f"File {file_path} not found")
