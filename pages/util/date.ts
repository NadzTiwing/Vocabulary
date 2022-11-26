export const formatDate = (date: Date, type: string) => {
    let dd = String(date.getDate()).padStart(2, '0');
    let yyyy = date.getFullYear();
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    switch(type) {
        case "fulldate":
            return month[date.getMonth()] + ' ' + dd + ', ' + yyyy;
        case "mm/dd/yyyy":
            return date.getMonth() + '/' + dd + '/' + yyyy;
    }
    
}
