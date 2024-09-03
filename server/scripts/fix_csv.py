import csv

# Input and output file paths
input_file_path = 'C:/Users/Jack/Documents/Repos/RoadRecord/server/public/csv/us-license-plates.csv'
output_file_path = 'C:/Users/Jack/Documents/Repos/RoadRecord/server/public/csv/us-license-plates-updated.csv'

# Columns to remove
columns_to_remove = ['source_img', 'source']

# Variations of the word "motorcycle" to check for
motorcycle_variations = ['motorcycle', 'motorcyle']

# Read the CSV file
with open(input_file_path, mode='r', newline='', encoding='utf-8') as infile:
    reader = csv.DictReader(infile)
    # Get the fieldnames excluding the columns to remove
    fieldnames = [field for field in reader.fieldnames if field not in columns_to_remove]

    # Write to the new CSV file
    with open(output_file_path, mode='w', newline='', encoding='utf-8') as outfile:
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()
        for row in reader:
            # Skip rows where plate_title contains any variation of the word "motorcycle"
            if any(variation in row['plate_title'].lower() for variation in motorcycle_variations):
                continue
            # Remove the unwanted columns
            for column in columns_to_remove:
                row.pop(column, None)
            writer.writerow(row)

print(f"Updated CSV file has been written to {output_file_path}")