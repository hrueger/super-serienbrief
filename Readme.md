# Super Serienbrief
> A simple tool to generate PDF Pages from a template file and a .xlsx file with data.

## Usage
- Add a file called `template.json` to the same dir as the executable. You can generate [here](https://pdfme.com/template-design)
- Add a file called `data.xlsx` to the same dir as the executable. The first row must contain the keys for the template.
- Run the executable

## Images
If the field is an image, a file with the same name as the value must be in the same dir as the executable. It can be a png, jpg or jpeg.

## Static Content (Dates, ...)
If a .txt file with the same name as the field exists, the content of the file will be used.

## License
MIT