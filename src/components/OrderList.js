// Importing necessary modules from React and external libraries
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/OrderList.css';
import '../css/Login.css';
import { PDFDownloadLink, Document, Page, Text, pdf } from '@react-pdf/renderer'; // PDF export
import download from 'downloadjs'; // For downloading files
import ExcelJS from 'exceljs'; // Excel export
import OrderListPDFDocument from '../components/OrderListPDFDocument'; // Import the OrderListPDFDocument component

// Defining the OrderList functional component
const OrderList = ({ accessToken }) => {
    // State to store the fetched orders, initialized as an empty array
    const [orders, setOrders] = useState([]);
    const [detailedOrder, setDetailedOrder] = useState(null);
    const [selectedCartId, setSelectedOrder] = useState(null);
    const [sortBy, setSortBy] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [currentPageDetails, setCurrentPageDetails] = useState(1);
    const [itemsDetailsPerPage, setItemsDetailsPerPage] = useState(5); // Number of items per page for details


    // State to manage sorting
    const [sortColumn, setSortColumn] = useState(''); // State to keep track of the currently sorted column
    const [sortOrder, setSortOrder] = useState(''); // State to keep track of the sorting order


    // Sorting state for order details
    const [sortColumnDetails, setSortColumnDetails] = useState('');
    const [sortOrderDetails, setSortOrderDetails] = useState('');

    const [itemsPerPage, setItemsPerPage] = useState(5); // Default number of items per page

    const [showStyledTable, setShowStyledTable] = useState(false); // State to toggle between normal and styled table

    // useEffect hook to fetch orders when the component mounts
    useEffect(() => {
        // Async function to fetch orders from the server
        const fetchOrders = async () => {
            console.log('access Token value order list', accessToken);
            try {
                // Making a GET request to the specified API endpoint
                const response = await axios.get('http://192.168.1.35:80/iorder/api/order', {
                    // Including query parameters in the request
                    params: {
                        sourcedb: 'SAMPLE',
                        salespersonid: 'BB',
                        status: 1,
                        datefrom: '',
                        dateto: '',
                        keysearch: '',
                        usercat: '1,2',
                        pagenumber: '1',
                        pagesize: '10',
                    },
                    headers: {
                        Authorization: 'Bearer ZmcDXdxZI4yA4wTmU2I-dGg0aNLqXTzpEJZTR2-vphBOkVOHfTsJyPxHYyjHgaC08lZlwsl4it519HUiZMEljtWJmTFl2QqvDxZJfjT9KW8Bws6h0dAukadNRALAfGEtpkfiXgf2q4j0l2SWv6QM3_vjUYnGk_ntAgv16KIAH24676V4PaaYoWISy4P6sJqaxdThzll-_OLYipEn-tF_k5sTLCBeiQ7uGdwN0u-IA2cBQem-cXcZybULrDU-kMwNz3Ej2pzUVsrBqFpFd9XFIPKs6_UGq0wdDF2vfugjsIb5BcuB3eH11cd6LqncM7eW1v55almc4MStrCICzkhupvDMVdlwbkFIfnydN5dGLuh39a7-tg-8dyKjrbZ-BkqGpCLrNAQhgZQBC0VPYqUgEJin8MCMAm-EW2KEOE2UJlY',
                        // Authorization: `Bearer ${accessToken}`,
                        /*single quotes '' is prevents the variable from being interpolated 
                         ,the literal string ${accessToken} is being used as the access token value
                         leading to a 401 (Unauthorized) error
                         */
                        /*use backticks ` instead of single quotes ' to correctly interpolate the accessToken variable into the string */
                    },
                });

                console.log('Fetched orders lists:', response.data.Result.Orders);
                setOrders(response.data.Result.Orders);
            } catch (error) {
                console.error('Error fetching orders', error);
            }
        };

        fetchOrders();
    }, [accessToken]);



    // useEffect hook to fetch orders when the component mounts
    const handleOrderClick = async (order) => {


        try {
            console.log('cartid 1:', selectedCartId);

            const response = await axios.get('http://192.168.1.35:80/iorder/api/order/detail', {
                params: {
                    sourcedb: 'SAMPLE',
                    salespersonid: 'BB',
                    cartid: order.CartID,
                    custid: order.CustID,

                },

                headers: {
                    Authorization: 'Bearer ZmcDXdxZI4yA4wTmU2I-dGg0aNLqXTzpEJZTR2-vphBOkVOHfTsJyPxHYyjHgaC08lZlwsl4it519HUiZMEljtWJmTFl2QqvDxZJfjT9KW8Bws6h0dAukadNRALAfGEtpkfiXgf2q4j0l2SWv6QM3_vjUYnGk_ntAgv16KIAH24676V4PaaYoWISy4P6sJqaxdThzll-_OLYipEn-tF_k5sTLCBeiQ7uGdwN0u-IA2cBQem-cXcZybULrDU-kMwNz3Ej2pzUVsrBqFpFd9XFIPKs6_UGq0wdDF2vfugjsIb5BcuB3eH11cd6LqncM7eW1v55almc4MStrCICzkhupvDMVdlwbkFIfnydN5dGLuh39a7-tg-8dyKjrbZ-BkqGpCLrNAQhgZQBC0VPYqUgEJin8MCMAm-EW2KEOE2UJlY',

                    // Authorization: `Bearer ${accessToken}`,
                },

            });
            console.log('accessToken Handle:', accessToken);
            // Updating the state with the fetched orders
            console.log('Fetched orders details:', response.data.Result.Order);

            setDetailedOrder(response.data.Result.Order);
            setSelectedOrder(order.CartID);
        } catch (error) {
            console.error('Error fetching order details', error);

        }
    };

    const handleSortByChange = (sortBy) => {

        // If the same column header is clicked again, reverse the sorting order
        if (sortBy === sortColumn) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // If a new column header is clicked, set sorting order to ascending
            setSortColumn(sortBy);
            setSortOrder('asc');
        }
    };

    // Function to handle sorting for all columns in order details
    const handleSortByChangeDetails = (sortBy) => {
        if (sortBy === sortColumnDetails) {
            setSortOrderDetails(sortOrderDetails === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumnDetails(sortBy);
            setSortOrderDetails('asc');
        }
    };

    // Sorting and filtering order details based on search term and sorting criteria
    const filteredDetails = detailedOrder?.ItemCart.filter((item) => {
        return (
            item.ItemNo.toLowerCase().includes(searchTerm) ||
            item.ItemDesc.toLowerCase().includes(searchTerm) ||
            item.Quantity.toString().includes(searchTerm) ||
            item.Price.toString().includes(searchTerm)
        );
    }) || [];


    // Function to sort items for all columns in order details
    const sortedDetails = filteredDetails.sort((a, b) => {
        switch (sortColumnDetails) {
            case 'itemNum':
                return sortOrderDetails === 'asc' ? a.ItemNo.localeCompare(b.ItemNo) : b.ItemNo.localeCompare(a.ItemNo);
            case 'ItemDesc':
                return sortOrderDetails === 'asc' ? a.ItemDesc.localeCompare(b.ItemDesc) : b.ItemDesc.localeCompare(a.ItemDesc);
            case 'Quantity':
                return sortOrderDetails === 'asc' ? a.Quantity - b.Quantity : b.Quantity - a.Quantity;
            case 'Price':
                return sortOrderDetails === 'asc' ? a.Price - b.Price : b.Price - a.Price;
            default:
                return 0;
        }
    });


    // Handle change in number of items per page
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value, 10));
        setCurrentPage(1); // Reset current page when changing items per page
    };

    // Function to handle change in number of items per page for details
    const handleItemsPerPageChangeDetails = (e) => {
        setItemsDetailsPerPage(parseInt(e.target.value, 10));
        setCurrentPageDetails(1); // Reset current page when changing items per page
    };




    // Function to format date to Malaysian format (DD/MM/YYYY)
    const formatDateToMalaysian = (dateString) => {
        // Check if the dateString is in the format 'YYYYMMDD'
        if (/^\d{8}$/.test(dateString)) {
            const year = dateString.substring(0, 4);
            const month = dateString.substring(4, 6);
            const day = dateString.substring(6, 8);
            return `${day}/${month}/${year}`;
        } else {
            // If the dateString is not in the expected format, return it as is
            return dateString;
        }
    };

    const handleViewDetails = (order) => {
        handleOrderClick(order);
    };

    const handleBackToList = () => {
        setDetailedOrder(null);
        setSelectedOrder(null);
    };


    const handleSearchTermChange = (e) => {
        const searchTerm = e.target.value.toLowerCase(); // Convert search term to lowercase for case-insensitive search
        setSearchTerm(searchTerm);
        setCurrentPage(1); // Reset current page to 1 when search term changes
    };


    const filteredOrders = orders.filter((order) => {
        // Convert grand total to a string for searching
        const grandTotalString = order.GrandTotal.toString();

        return (
            // Search by Customer ID
            order.CustID.toLowerCase().includes(searchTerm) ||
            // Search by Cart ID
            order.CartID.toLowerCase().includes(searchTerm) ||
            // Search by Customer Name
            order.CustName.toLowerCase().includes(searchTerm) ||
            // Search by Order Date (formatted as DD/MM/YYYY)
            formatDateToMalaysian(order.OrderDate).includes(searchTerm) ||
            // Search by Grand Total (numeric comparison)
            grandTotalString.includes(searchTerm) ||
            // Search by No
            (parseInt(order.No) === parseInt(searchTerm)) // Assume 'No' is a string in the order object
        );
    });

    // Function to compare dates for sorting
    const compareDates = (dateA, dateB) => {
        const dateObjA = new Date(parseInt(dateA.split('/').reverse().join(''), 10));
        const dateObjB = new Date(parseInt(dateB.split('/').reverse().join(''), 10));
        return sortOrder === 'asc' ? dateObjA - dateObjB : dateObjB - dateObjA;
    };

    let sortedOrders = [...filteredOrders];


    // Sort orders based on the selected column and sorting order
    if (sortColumn === 'date') {
        sortedOrders = sortedOrders.sort((a, b) => compareDates(a.OrderDate, b.OrderDate));
    }
    else if (sortColumn === 'character') {
        sortedOrders = sortedOrders.sort((a, b) => {
            return sortOrder === 'asc' ? a.CustName.localeCompare(b.CustName) : b.CustName.localeCompare(a.CustName);
        });
    } else if (sortColumn === 'id') {
        sortedOrders = sortedOrders.sort((a, b) => {
            return sortOrder === 'asc' ? a.CustID.localeCompare(b.CustID) : b.CustID.localeCompare(a.CustID);
        });
    } else if (sortColumn === 'number') {
        sortedOrders = sortedOrders.sort((a, b) => {
            return sortOrder === 'asc' ? parseFloat(a.GrandTotal) - parseFloat(b.GrandTotal) : parseFloat(b.GrandTotal) - parseFloat(a.GrandTotal);
        });
    }



    // Pagination for order list
    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);


    const indexOfLastDetail = currentPageDetails * itemsPerPage;
    const indexOfFirstDetail = indexOfLastDetail - itemsPerPage;
    const currentDetails = detailedOrder?.ItemCart.slice(indexOfFirstDetail, indexOfLastDetail) || [];


    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const paginateDetails = (pageNumber) => setCurrentPageDetails(pageNumber);

    // setSelectedOrder
    return (
        <div className="order-container">
            {detailedOrder ? (
                <div className="order-details-container">
                    <h2>Order Details</h2>

                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchTermChange}
                    />
                    <div>
                        Show:
                        <select value={itemsDetailsPerPage} onChange={handleItemsPerPageChangeDetails}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                        </select>
                        entries
                    </div>



                    <table className="order-details-table">
                        <button onClick={handleBackToList}>Back</button>

                        <thead>
                            <tr>
                                <th>No</th>
                                <th onClick={() => handleSortByChangeDetails('itemNum')}>Item Number</th>
                                <th onClick={() => handleSortByChangeDetails('ItemDesc')}>Item Desc</th>
                                <th onClick={() => handleSortByChangeDetails('Quantity')}>Quantity</th>
                                <th onClick={() => handleSortByChangeDetails('Price')}>Price</th>

                            </tr>
                        </thead>
                        <tbody>
                            {sortedDetails.map((item, index) => (
                                <tr key={index}>
                                    <td>{indexOfFirstDetail + index + 1}</td>
                                    <td>{item.ItemNo}</td>
                                    <td>{item.ItemDesc}</td>
                                    <td>{item.Quantity}</td>
                                    <td>{item.Price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        itemsPerPage={itemsDetailsPerPage}
                        totalItems={detailedOrder?.ItemCart.length || 0}
                        paginate={paginateDetails}
                        currentPage={currentPageDetails} />
                </div>
            ) : (

                
                <div className="order-list-container">
                    {/* Add PDF and Excel export buttons */}
                    <button onClick={() => exportToPDF(currentOrders)}>Export to PDF</button>
                    <button onClick={() => exportToExcel(currentOrders)}>Export to Excel</button>

                    <h1>Order List</h1>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchTermChange}
                    />
                    <div>
                        Show:
                        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                        </select>
                        entries
                    </div>
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSortByChange('No')}>No</th>
                                <th onClick={() => handleSortByChange('id')}>Customer ID</th>
                                <th onClick={() => handleSortByChange('id')}>Cart ID</th>
                                <th onClick={() => handleSortByChange('character')}>Customer Name</th>
                                <th onClick={() => handleSortByChange('date')}>Order Date</th>
                                <th onClick={() => handleSortByChange('number')}>Grand Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map((order, index) => (
                                <tr
                                    key={index}
                                    onClick={() => handleOrderClick(order)}
                                    className={selectedCartId === order.CartID ? 'selected' : ''}
                                >
                                    <td>{indexOfFirstOrder + index + 1}</td>
                                    <td>{order.CustID}</td>
                                    <td>{order.CartID}</td>
                                    <td>{order.CustName}</td>
                                    <td>{formatDateToMalaysian(order.OrderDate)}</td>
                                    <td>{order.GrandTotal}</td>
                                    <td><button onClick={() => handleViewDetails(order)}>View Details</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={sortedOrders.length}
                        paginate={paginate}
                        currentPage={currentPage} />
                </div>
            )}
        </div>
    );
};
// /// Define the PDF document structure in a separate component
// const OrderListPDFDocument = ({ orders }) => (
//     <Document>
//       <Page>
//         {orders.map((order, index) => (
//           <Text key={index}>
//             {order.CustID}, {order.CustName}, {order.OrderDate}, {order.GrandTotal}
//           </Text>
//         ))}
//       </Page>
//     </Document>
//   );

const exportToPDF = async (orders) => {
    try {
        // Render the orders data into a PDF document using the OrderListPDFDocument component
        const pdfDoc = <OrderListPDFDocument orders={orders} />;

        // Convert the PDF document to a Blob
        const pdfBlob = await pdf(pdfDoc).toBlob(); // Await the result of toBlob()

        // Create a URL for the Blob
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Create a link element
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.target = '_blank'; // Open the PDF in a new tab
        link.rel = 'noopener noreferrer'; // Security best practice
        link.download = 'OrderList.pdf'; // Optional: Set the default file name

        // Append the link to the body and click it to trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up by revoking the URL
        URL.revokeObjectURL(pdfUrl);

        // Remove the link element from the body
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error exporting to PDF:', error);
    }
};



// Function to handle exporting order list to Excel
const exportToExcel = (orders) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Orders');

    // Add headers
    worksheet.addRow(['Customer ID', 'Customer Name', 'Order Date', 'Grand Total']);

    // Add data rows
    orders.forEach(order => {
        worksheet.addRow([order.CustID, order.CustName, order.OrderDate, order.GrandTotal]);
    });

    // Generate blob
    workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'OrderList.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
    });
};





const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Calculate the range of items being displayed on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPageItems = Math.min(totalItems, indexOfLastItem) - indexOfFirstItem;

    // Page range selection
    const handlePageRangeChange = (e) => {
        const range = e.target.value.split('-');
        const start = parseInt(range[0], 10);
        const end = parseInt(range[1], 10);
        paginate(start);
    };

    // Dynamic pagination
    const displayPageNumbers = totalPages <= 10 ? Array.from({ length: totalPages }, (_, i) => i + 1) :
        Array.from({ length: 10 }, (_, i) => {
            if (currentPage <= 6) return i + 1;
            if (totalPages - currentPage <= 4) return totalPages - 9 + i;
            return currentPage - 5 + i;
        });

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>

            <ul className="pagination">

                {/* Show current range and total items */}
                <li className="show-items">Show {currentPageItems} of {totalItems}</li>

                {/* Page range selection */}
                <li>
                    <select onChange={handlePageRangeChange}>
                        {[...Array(Math.ceil(totalPages / 5)).keys()].map((page) => (
                            <option key={page + 1} value={`${page * 5 + 1}-${Math.min((page + 1) * 5, totalPages)}`}>
                                {`${page * 5 + 1}-${Math.min((page + 1) * 5, totalPages)}`}
                            </option>
                        ))}
                    </select>
                </li>

                {/* Previous button */}
                <li>
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                </li>

                {/* Page numbers */}
                {displayPageNumbers.map((pageNumber) => (
                    <li key={pageNumber} className={currentPage === pageNumber ? "active" : ""}>
                        <button onClick={() => paginate(pageNumber)}>{pageNumber}</button>
                    </li>
                ))}




                {/* Next button */}
                <li>
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                </li>
            </ul>
        </nav>
    );
};

export default OrderList;


