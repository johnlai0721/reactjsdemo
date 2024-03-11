import React from 'react';
import { Document, Page, View, Text, StyleSheet, pdf } from '@react-pdf/renderer';

const OrderListPDFDocument = ({ orders }) => (
  <Document>
    <Page>
      <View style={styles.container}>
        <Text style={styles.header}>Order List</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>Customer ID</Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>Customer Name</Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>Order Date</Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>Grand Total</Text>
            </View>
          </View>
          {orders.map((order, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text>{order.CustID}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{order.CustName}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{order.OrderDate}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{order.GrandTotal}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  table: {
    display: 'table',
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flex: 1,
  },
  headerText: {
    fontWeight: 'bold',
  },
  tableCell: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flex: 1,
  },
});

export default OrderListPDFDocument;
