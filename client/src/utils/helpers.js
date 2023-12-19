function formatDateTime(datetimeString) {
        const dateTime = new Date(datetimeString);
    
        const options = {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        };
    
        const datePart = dateTime.toLocaleDateString('en-US', options);
        const timePart = dateTime.toLocaleTimeString('en-US', options);
    
        const [date, time] = datePart.split(',').concat(timePart.split(','));
    
        return {
        date: date.trim(),
        time: time.trim(),
        };
    }

function convertDateFormat(inputDate) {

    const isoDate = new Date(inputDate);
    
        if (isNaN(isoDate)) {
        console.error('Invalid date format. Please provide a valid ISO date string.');
        return null;
        }
    
        const year = isoDate.getFullYear();
        const month = String(isoDate.getMonth() + 1).padStart(2, '0');
        const day = String(isoDate.getDate()).padStart(2, '0');
    
        const formattedDate = `${year}`;
        
        return formattedDate;
    }

    export { formatDateTime, convertDateFormat }