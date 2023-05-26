export const getDateFormatted = (createdAt) => {
    const date = new Date(createdAt.seconds * 1000);
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
    ];

    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();

    return `${day} ${monthNames[month]} ${year}`;
};
