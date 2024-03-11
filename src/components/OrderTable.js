import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Document, Page, Text, View, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import ExcelJS from 'exceljs';
import download from 'downloadjs';
import '../css/OrderTable.css';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 10,
    },
    section: {
        marginBottom: 10,
    },
    table: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: { flexDirection: 'row' },
    tableCol: {
        width: '25%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
});

const OrderTable = ({ accessToken }) => {
    const [orders, setOrders] = useState([]);
    const [showStyledTable, setShowStyledTable] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://192.168.111.170/johnsonweb/api/order');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders', error);
            }
        };

        fetchOrders();
    }, []);



 

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Orders');

        // Add headers
        worksheet.addRow(['Customer ID', 'Order Date', 'Total Amount']);

        // Add data rows
        orders.forEach(order => {
            worksheet.addRow([order.customerID, order.orderDate, order.totalAmount]);
        });

        // Generate buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Create blob
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'OrderList.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    
    const exportToWord = async () => {
        const htmlContent = `
            <html>
                <head><title>Order List</title></head>
                <body>
                    <h2>Order List</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Customer ID</th>
                                <th>Order Date</th>
                                <th>Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orders.map(order => `
                                <tr>
                                    <td>${order.customerID}</td>
                                    <td>${order.orderDate}</td>
                                    <td>${order.totalAmount}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;

        const blob = new Blob([htmlContent], { type: 'application/msword' });
        download(blob, 'OrderList.doc');
    };

      




    

    const handleDownloadClick = () => {
        setShowStyledTable(true);
    };
    return (
        <div>
            {!showStyledTable && (
                <div>
                    <h2>Order List</h2>

                    <table>
                        <thead>
                            <tr>
                                <th>Customer ID</th>
                                <th>Order Date</th>
                                <th>Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.customerID}</td>
                                    <td>{order.orderDate}</td>
                                    <td>{order.totalAmount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={handleDownloadClick}>Download</button>
                </div>
            )}
            {showStyledTable && (
                <div>
                    <PDFViewer style={{ width: '100%', height: '50vh' }}>
                        <Document>
                            <Page size="A4" style={styles.page}>
                                <View style={styles.section}>
                                    <Text style={{ fontSize: 20, marginBottom: 10 }}>Order List</Text>
                                    <View style={styles.table}>
                                        <View style={[styles.tableRow, { fontWeight: 'bold' }]}>
                                            <Text style={styles.tableCol}>Customer ID</Text>
                                            <Text style={styles.tableCol}>Order Date</Text>
                                            <Text style={styles.tableCol}>Total Amount</Text>
                                        </View>
                                        {orders.map(order => (
                                            <View key={order.id} style={styles.tableRow}>
                                                <Text style={styles.tableCol}>{order.customerID}</Text>
                                                <Text style={styles.tableCol}>{order.orderDate}</Text>
                                                <Text style={styles.tableCol}>{order.totalAmount}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </Page>
                        </Document>
                    </PDFViewer>
                    <PDFDownloadLink document={<Document>
                        <Page size="A4" style={styles.page}>
                            <View style={styles.section}>
                                <Text style={{ fontSize: 20, marginBottom: 10 }}>Order List</Text>
                                <View style={styles.table}>
                                    <View style={[styles.tableRow, { fontWeight: 'bold' }]}>
                                        <Text style={styles.tableCol}>Customer ID</Text>
                                        <Text style={styles.tableCol}>Order Date</Text>
                                        <Text style={styles.tableCol}>Total Amount</Text>
                                    </View>
                                    {orders.map(order => (
                                        <View key={order.id} style={styles.tableRow}>
                                            <Text style={styles.tableCol}>{order.customerID}</Text>
                                            <Text style={styles.tableCol}>{order.orderDate}</Text>
                                            <Text style={styles.tableCol}>{order.totalAmount}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </Page>
                    </Document>} fileName="OrderList.pdf">
                        {({ blob, url, loading, error }) =>
                            loading ? 'Loading document...' : 'Download PDF'
                        }
                    </PDFDownloadLink>
                    <button onClick={exportToWord}>Export to Word</button>
                    <button onClick={exportToExcel}>Export to Excel</button>
                </div>
            )}
        </div>
    );
};

export default OrderTable;