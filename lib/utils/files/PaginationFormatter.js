export function PaginationFormatter(paginations, totalItems, prefix, params = []) {
    const totalPages = Math.ceil(totalItems / paginations.limit);
    const previous = paginations.page == 1 ? paginations.page : paginations.page - 1;
    const next =
        paginations.page >= totalPages ?
        paginations.page :
        typeof paginations.page == 'string' ?
        Number(paginations.page) + 1 :
        paginations.page + 1;
    return {
        page: paginations.page,
        perPage: paginations.limit,
        totalItems: totalItems,
        totalPages: totalPages,
        nextPageLink: FormatParam(
            `${process.env.APP_URL}${process.env.API_BASE_URL}/${process.env.API_VERSION}/${prefix}?page=${next}&limit=${paginations.limit}`,
            params,
        ),
        previousPageLink: FormatParam(
            `${process.env.APP_URL}${process.env.API_BASE_URL}/${process.env.API_VERSION}/${prefix}?page=${previous}&limit=${paginations.limit}`,
            params,
        ),
    }
}

function FormatParam(link, params) {
    let newLink = link;

    params.forEach((param) => {
        newLink += `&${param.key}`;
        newLink += `=${param.value}`;
    });

    return newLink;
}