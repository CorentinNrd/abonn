export const toCSV = (data, total) => {
    const csvRows = [];
    const headers = ['name', 'type', 'price'];
    const totalRow = ['Total', '', total];
    csvRows.push(headers.join(','));
    data.forEach(item => {
        const row = [];
        row.push(item.item.name);
        row.push(item.item.type);
        row.push(parseFloat(item.price));
        csvRows.push(row.join(','));
    });
    csvRows.push(totalRow.join(','));

    const csvString = csvRows.join('\n');
    // Create a Blob from the CSV string
    const blob = new Blob([csvString], {type: 'text/csv'});
    // Create a link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'abonnme.csv');
    // Append to the document
    document.body.appendChild(link);
    // Trigger the download
    link.click();
    // Clean up and remove the link
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    return csvString;
}