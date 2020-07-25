import React from "react";
import { Menu } from "antd";
import MarketCounter from "./MarketCounter";
import {
  UserOutlined,
  StockOutlined,
  UnorderedListOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const menuLabels = ["Positions", "Companies", "Earnings Calendar", "Account"];
const menuIcons = [
  <StockOutlined />,
  <UnorderedListOutlined />,
  <CalendarOutlined />,
  <UserOutlined />,
];

export default function Sidebar(props) {
  function getMenuItems() {
    let items = [];
    for (let i = 0; i < menuLabels.length; i++) {
      items.push(
        <Menu.Item
          key={i}
          onClick={() => {
            props.setMenuOption(i);
          }}
          icon={menuIcons[i]}
        >
          {menuLabels[i]}
        </Menu.Item>
      );
    }

    return items;
  }

  return (
    <Menu
      mode="inline"
      style={{ maxWidth: "17vw" }}
      defaultSelectedKeys={["0"]}
    >
      <MarketCounter></MarketCounter>
      <Menu.Divider></Menu.Divider>
      {getMenuItems()}
    </Menu>
  );
}
