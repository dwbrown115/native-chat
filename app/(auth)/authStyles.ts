import { StyleSheet } from "react-native";

const AuthStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    flexDirection: "column",
    width: "11%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 5,
    marginTop: 2.5,
    marginBottom: 2.5,
    // margin: 5,
    // width: 210,
    width: "100%",
  },
  wrapper: {
    // flex: 1,
    // display: "flex",
    flexDirection: "row",
    // padding: 5,
    // marginTop: 5,
    justifyContent: "space-between",
    // margin: 5,
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    marginTop: 5,
    // margin: 5,
    backgroundColor: "#2196f3",
    color: "white",
    alignItems: "center",
    padding: 8,
    fontFamily: "sans-serif",
    fontWeight: "600",
    borderRadius: 2,
    textTransform: "uppercase",
    fontSize: 14,
    letterSpacing: 0.4,
    // marginHorizontal: 20,
    // width: 100,
    width: "48%",
  },
  show: {
    marginLeft: -50,
    paddingRight: 10,
  },
});

export default AuthStyles;
