import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  View,
  RefreshControl,
} from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useAuthContext } from "../../../contexts/authContext";
import {
  calculateCartTotals,
  getOrderDetails,
} from "../../SalesOrder/helpers/salesOrderHelper";
import Product from "./Product";
import OutletAddress from "./OutletAddress";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { format } from "date-fns";

function OrderDetail({ navigation, route }) {
  const { user } = useAuthContext();
  const theme = useTheme();
  const { order } = route.params;
  const [refreshing, setRefreshing] = useState(true);
  const [orderDetails, setOrderDetails] = useState([]);
  const [errors, setErrors] = useState({});
  const [shown, setShown] = useState(false);
  const [showmenueItem, setShowmenueItem] = useState(false);

  const { totalAmount } = calculateCartTotals(orderDetails);

  useEffect(() => {
    if (!user) return;
    setErrors({ ...errors, products: "" });
    fetchOrderDetails();
  }, [order.orderid]);

  const fetchOrderDetails = async () => {
    setRefreshing(true);
    try {
      const res = await getOrderDetails(user.distributorId, order.orderid);
      if (!res.error) {
        setOrderDetails(
          res.data?.map((item) => ({
            discount: item.discount || 0,
            price: item.productprice,
            gstrate: item.productgstrate,
            productid: item.productid,
            productname: item.productname,
            manufacturer: item.manufacturer || null,
            quantity: item.productquantity || 0,
            retailerId: item.retailerid,
            ...item,
          }))
        );
      } else {
        Alert.alert("Error", "Error fetching order");
      }
    } catch (err) {
      setErrors({ ...errors, products: "Failed to get products" });
    } finally {
      setRefreshing(false);
    }
  };

  const redirect = () => {
    navigation.navigate("UpdateOrder", {
      order,
    });
  };
  const value = null;

  const renderProduct = useCallback(({ item }) => {
    return <Product item={item} />;
  }, []);

  const html = `<html>
  <head>
    <meta charset="utf-8" />
    <title>A simple, clean, and responsive HTML invoice template</title>

    <style>
      .invoice-box {
        max-width: 800px;
        margin: auto;
        padding: 30px;
        border: 1px solid #eee;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
        font-size: 16px;
        line-height: 24px;
        font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
        color: #555;
      }

      .invoice-box table {
        width: 100%;
        line-height: inherit;
        text-align: left;
      }

      .invoice-box table td {
        padding: 5px;
        vertical-align: top;
      }

      .invoice-box table tr td:nth-child(2) {
        text-align: right;
      }

      .invoice-box table tr.top table td {
        padding-bottom: 20px;
      }

      .invoice-box table tr.top table td.title {
        font-size: 45px;
        line-height: 45px;
        color: #333;
      }

      .invoice-box table tr.information table td {
        padding-bottom: 40px;
      }

      .invoice-box table tr.heading td {
        background: #eee;
        border-bottom: 1px solid #ddd;
        font-weight: bold;
      }

      .invoice-box table tr.details td {
        padding-bottom: 20px;
      }

      .invoice-box table tr.item td {
        border-bottom: 1px solid #eee;
      }

      .invoice-box table tr.item.last td {
        border-bottom: none;
      }

      .invoice-box table tr.total td:nth-child(2) {
        border-top: 2px solid #eee;
        font-weight: bold;
      }

      @media only screen and (max-width: 600px) {
        .invoice-box table tr.top table td {
          width: 100%;
          display: block;
          text-align: center;
        }

        .invoice-box table tr.information table td {
          width: 100%;
          display: block;
          text-align: center;
        }
      }

      /** RTL **/
      .invoice-box.rtl {
        direction: rtl;
        font-family: Tahoma, "Helvetica Neue", "Helvetica", Helvetica, Arial,
          sans-serif;
      }

      .invoice-box.rtl table {
        text-align: right;
      }

      .invoice-box.rtl table tr td:nth-child(2) {
        text-align: left;
      }
    </style>
  </head>

  <body>
    <div class="invoice-box">
      <table cellpadding="0" cellspacing="0" style="margin-top:0;">
        <tr class="top">
          <td colspan="6">
            <table>
            <center style="margin-bottom: 0">
            <h2>Sales Invoice</h2>
          </center>
              <tr>
                <td>
                <img
                src="https://i.ibb.co/cwZMcVt/logo192.png"
                style="height:50px;width:50px;"
                  />
                </td>
                <td>
                Order Id: ${order.orderid}<br />
                  Invoice Date: ${format(
                    new Date(order.orderdate),
                    " MMMM dd, yyyy"
                  )}
                </td>
               </tr>
            </table>
          </td>
        </tr>

        <tr class="information">
          <td colspan="6">
            <table style="width:100%;">
              <tr style="display:flex; justify-content:space-between;">
                <td style="width:45%;word-wrap:break-word;">
                  ${user.userName}
                  ${
                    orderDetails[0]?.distributorstreet1 == value ? "<br />" : ""
                  }
                      ${
                        orderDetails[0]?.distributorstreet1 !== value
                          ? orderDetails[0]?.distributorstreet1
                          : ""
                      }
                      ${
                        orderDetails[0]?.distributorstreet1 == value
                          ? ""
                          : "<br />"
                      }
                      ${
                        orderDetails[0]?.distributorstreet2 !== value
                          ? orderDetails[0]?.distributorstreet2
                          : ""
                      }
                      ${
                        orderDetails[0]?.distributorstreet2 == value
                          ? ""
                          : "<br />"
                      }
                      ${
                        orderDetails[0]?.distributorlandmark !== value
                          ? orderDetails[0]?.distributorlandmark
                          : ""
                      }
                      ${
                        orderDetails[0]?.distributorlandmark == value
                          ? ""
                          : "<br />"
                      }
                      ${user?.city && `${user?.city}`}
                      ${
                        orderDetails[0]?.distributorstate !== value
                          ? `, ${orderDetails[0]?.distributorstate}`
                          : ""
                      }
                      ${
                        orderDetails[0]?.distributorzipcode !== value
                          ? `, ${orderDetails[0]?.distributorzipcode}`
                          : ""
                      }
                      <br/>
                      +91 ${user?.mobileNo}
                </td>

                <td style="width:45%;word-wrap:break-word;">
                  ${order.name}
                  ${orderDetails[0]?.retailerstreet1 == value ? "<br />" : ""}
                      ${
                        orderDetails[0]?.retailerstreet1 !== value
                          ? orderDetails[0]?.retailerstreet1
                          : ""
                      }
                      ${
                        orderDetails[0]?.retailerstreet1 == value
                          ? ""
                          : "<br />"
                      }
                      ${
                        orderDetails[0]?.retailerstreet2 !== value
                          ? orderDetails[0]?.retailerstreet2
                          : ""
                      }
                      ${
                        orderDetails[0]?.retailerstreet2 == value
                          ? ""
                          : "<br />"
                      }
                      ${
                        orderDetails[0]?.retailerlandmark !== value
                          ? orderDetails[0]?.retailerlandmark
                          : ""
                      }
                      ${
                        orderDetails[0]?.retailerlandmark == value
                          ? ""
                          : "<br />"
                      }
                      ${orderDetails[0]?.city && `${orderDetails[0]?.city}`}
                      ${
                        orderDetails[0]?.retailerstate !== value
                          ? `, ${orderDetails[0]?.retailerstate}`
                          : ""
                      }
                      ${
                        orderDetails[0]?.retailerzipcode !== value
                          ? `, ${orderDetails[0]?.retailerzipcode}`
                          : ""
                      }
                      <br/>
                      +91 ${orderDetails[0]?.mobileno}
                </td>
              </tr>
            </table>
            <hr/>
          </td>
        </tr>
        
        <tr class="heading">
      <td>Item</td>
      <td>Quantity</td>
      <td></td>
      <td></td>
      <td></td>
      <td>Price</td>
    </tr>

    ${orderDetails
      ?.map(
        (val) =>
          `<tr class="item" style="width:100%;"> <td style="width:50%;"><p> ${
            val.productname
          }</p></td><td>${val.productquantity}</td><td></td>
          <td></td>
          <td></td><td style="width:20%;">${`\u20B9`}${Number(
            val.price * val.productquantity
          )}</td> </tr>`
      )
      .join("")}

      <tr class="total">
          <td colspan="6">
            <table>
              <tr>
                <td>
                </td>
                <td>Total: ${totalAmount}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
`;
  const print = async () => {
    await Print.printAsync({
      html,
    });
  };

  const generatePdf = async () => {
    // <a href="https://imgbb.com/"><img src="" alt="logo192" border="0" /></a>
    const file = await Print.printToFileAsync({
      html: html,
      base64: false,
    });
    await Sharing.shareAsync(file.uri);
  };

  const productKeyExtractor = useCallback((product) => product.productid, []);

  return (
    <>
      <View style={styles.heading}>
        <View style={styles.flexContainer}>
          <Text style={{ width: "70%" }} variant="titleMedium">
            <Text style={{ color: "gray" }}>Customer:</Text> {order.name}
          </Text>
          <Text variant="titleMedium" style={styles.orderid}>
            ID: {order.orderid}
          </Text>
        </View>
        <View style={styles.flexContainer}>
          <Text variant="titleMedium">
            <Text style={{ color: "gray" }}>Products:</Text>{" "}
            {orderDetails?.length}
          </Text>
          <Text variant="titleMedium">
            <Text style={{ color: "gray" }}>Status:</Text>{" "}
            {orderDetails[0]?.orderstatus}
          </Text>
        </View>
        <View style={styles.flexContainer}>
          <Text variant="titleMedium">
            <Text style={{ color: "gray" }}>Total:</Text> {`\u20B9`}{" "}
            {totalAmount}
          </Text>
          <Text variant="titleMedium">
            <Text style={{ color: "gray" }}>Items:</Text>{" "}
            {orderDetails?.reduce(
              (total, item) => Number(total) + Number(item.productquantity),
              Number(0)
            )}
          </Text>
        </View>
        <View
          style={{
            ...styles.flexContainer,
            ...styles.updateButtonContainer,
          }}
        >
          <Text variant="titleMedium">Products:</Text>
          {orderDetails[0]?.orderstatus === "Placed" &&
            orderDetails[0]?.ispaid == false && (
              <Button
                mode="contained"
                onPress={redirect}
                style={{
                  width: "50%",
                  height: 50,
                  backgroundColor: theme.colors.primary,
                  justifyContent: "center",
                }}
              >
                Update order
              </Button>
            )}
        </View>
      </View>
      <FlatList
        removeClippedSubviews={false}
        keyExtractor={productKeyExtractor}
        data={orderDetails}
        renderItem={renderProduct}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchOrderDetails}
          />
        }
        contentContainerStyle={{ paddingBottom: 70 }}
      />

      {showmenueItem && (
        <Text style={{ position: "absolute", bottom: 80, right: 10 }}>
          <Button mode="contained" onPress={() => setShown(true)}>
            Outlet Address
          </Button>
        </Text>
      )}
      {showmenueItem && (
        <Text style={{ position: "absolute", bottom: 150, right: 10 }}>
          <Button mode="contained" onPress={generatePdf}>
            Send Invoice
          </Button>
        </Text>
      )}
      {showmenueItem && (
        <Text style={{ position: "absolute", bottom: 220, right: 10 }}>
          <Button mode="contained" onPress={print}>
            Print
          </Button>
        </Text>
      )}

      <Text style={{ position: "absolute", right: 10, bottom: 10 }}>
        <Button
          mode="contained"
          onPress={() => setShowmenueItem(!showmenueItem)}
          style={{}}
        >
          <Text style={{ color: "white" }} variant="titleMedium">
            {showmenueItem ? "x" : "+"}
          </Text>
        </Button>
      </Text>

      {/*OutletAddress*/}
      <OutletAddress
        visible={shown}
        onDismiss={() => setShown(false)}
        userId={orderDetails[0]?.retailerId}
        retailerName={order.name}
        mobileno={order.mobileno}
      />
      {/*OutletAddress*/}
    </>
  );
}

export default OrderDetail;

const styles = StyleSheet.create({
  heading: {
    padding: 10,
    paddingBottom: 5,
  },
  orderButton: {
    borderRadius: 3,
    paddingVertical: 5,
  },
  flexContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  updateButtonContainer: {
    borderTopColor: "silver",
    borderTopWidth: 1,
    alignItems: "center",
    marginTop: 5,
    paddingTop: 5,
  },
  orderid: { width: "30%", textAlign: "right" },
  menuitems: {
    padding: 10,
  },
});
