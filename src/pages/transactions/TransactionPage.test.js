import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TransactionPage from "./TransactionPage";
import ApiService from "../../apis/index";
import dayjs from "dayjs";

jest.mock("../../apis/index");
describe("Transaction Component", () => {
  const mockCustomers = [
    {
      id: 1,
      customer_name: "John Doe",
    },
    {
      id: 2,
      customer_name: "Jane Smith",
    },
    {
      id: 3,
      customer_name: "Michael Johnson",
    },
    {
      id: 4,
      customer_name: "Emily Davis",
    },
    {
      id: 5,
      customer_name: "David Miller",
    },
    {
      id: 6,
      customer_name: "Sarah Wilson",
    },
    {
      id: 7,
      customer_name: "James Brown",
    },
    {
      id: 8,
      customer_name: "Patricia Taylor",
    },
    {
      id: 9,
      customer_name: "Daniel Anderson",
    },
    {
      id: 10,
      customer_name: "Laura Thomas",
    },
    {
      id: 11,
      customer_name: "William Jackson",
    },
    {
      id: 12,
      customer_name: "Linda White",
    },
    {
      id: 13,
      customer_name: "Robert Harris",
    },
    {
      id: 14,
      customer_name: "Elizabeth Clark",
    },
    {
      id: 15,
      customer_name: "Joseph Lewis",
    },
    {
      id: 16,
      customer_name: "Barbara Walker",
    },
    {
      id: 17,
      customer_name: "Charles Hall",
    },
    {
      id: 18,
      customer_name: "Jessica Allen",
    },
    {
      id: 19,
      customer_name: "Thomas Young",
    },
    {
      id: 20,
      customer_name: "Nancy King",
    },
    {
      id: 21,
      customer_name: "Mark Scott",
    },
    {
      id: 22,
      customer_name: "Helen Adams",
    },
    {
      id: 23,
      customer_name: "Paul Nelson",
    },
    {
      id: 24,
      customer_name: "Margaret Carter",
    },
    {
      id: 25,
      customer_name: "Steven Mitchell",
    },
    {
      id: 26,
      customer_name: "Karen Perez",
    },
    {
      id: 27,
      customer_name: "Daniel Roberts",
    },
    {
      id: 28,
      customer_name: "Sophia Turner",
    },
    {
      id: 29,
      customer_name: "Matthew Phillips",
    },
    {
      id: 30,
      customer_name: "Olivia Evans",
    },
  ];

  const mockTransactions = [
    {
      id: 1,
      purchase_date: 1698796800,
      product_name: "Wireless Mouse",
      product_price: 120.5,
      customerId: 1,
    },
    {
      id: 2,
      purchase_date: 1701398400,
      product_name: "Laptop Stand",
      product_price: 80.25,
      customerId: 2,
    },
    {
      id: 3,
      purchase_date: 1704076800,
      product_name: "Mechanical Keyboard",
      product_price: 250.99,
      customerId: 3,
    },
    {
      id: 4,
      purchase_date: 1706755200,
      product_name: "Bluetooth Headphones",
      product_price: 300.75,
      customerId: 4,
    },
    {
      id: 5,
      purchase_date: 1709347200,
      product_name: "USB-C Cable",
      product_price: 15.1,
      customerId: 5,
    },
    {
      id: 6,
      purchase_date: 1712025600,
      product_name: "External Hard Drive",
      product_price: 349.49,
      customerId: 6,
    },
    {
      id: 7,
      purchase_date: 1714617600,
      product_name: "Portable Charger",
      product_price: 50.99,
      customerId: 7,
    },
    {
      id: 8,
      purchase_date: 1717296000,
      product_name: "Smartphone Case",
      product_price: 20.75,
      customerId: 8,
    },
    {
      id: 9,
      purchase_date: 1719974400,
      product_name: "Wireless Earbuds",
      product_price: 199.99,
      customerId: 9,
    },
    {
      id: 10,
      purchase_date: 1722566400,
      product_name: "Tablet Stand",
      product_price: 45.2,
      customerId: 10,
    },
    {
      id: 11,
      purchase_date: 1700112000,
      product_name: "Webcam",
      product_price: 99.99,
      customerId: 1,
    },
    {
      id: 12,
      purchase_date: 1702704000,
      product_name: "Gaming Mousepad",
      product_price: 25.49,
      customerId: 2,
    },
    {
      id: 13,
      purchase_date: 1705382400,
      product_name: "Monitor Arm",
      product_price: 150.0,
      customerId: 3,
    },
    {
      id: 14,
      purchase_date: 1708060800,
      product_name: "Docking Station",
      product_price: 300.89,
      customerId: 4,
    },
    {
      id: 15,
      purchase_date: 1710652800,
      product_name: "Noise-Cancelling Headphones",
      product_price: 320.55,
      customerId: 5,
    },
    {
      id: 16,
      purchase_date: 1713331200,
      product_name: "Ergonomic Chair",
      product_price: 349.99,
      customerId: 6,
    },
    {
      id: 17,
      purchase_date: 1715913600,
      product_name: "Laptop Cooler",
      product_price: 45.65,
      customerId: 7,
    },
    {
      id: 18,
      purchase_date: 1718592000,
      product_name: "HDMI Cable",
      product_price: 15.99,
      customerId: 8,
    },
    {
      id: 19,
      purchase_date: 1721270400,
      product_name: "Power Bank",
      product_price: 90.49,
      customerId: 9,
    },
    {
      id: 20,
      purchase_date: 1723852800,
      product_name: "Wireless Charger",
      product_price: 60.99,
      customerId: 10,
    },
    {
      id: 21,
      purchase_date: 1700736000,
      product_name: "Keyboard Wrist Rest",
      product_price: 20.0,
      customerId: 1,
    },
    {
      id: 22,
      purchase_date: 1703414400,
      product_name: "Monitor Calibration Tool",
      product_price: 85.1,
      customerId: 2,
    },
    {
      id: 23,
      purchase_date: 1706092800,
      product_name: "Printer Ink Cartridge",
      product_price: 70.75,
      customerId: 3,
    },
    {
      id: 24,
      purchase_date: 1708771200,
      product_name: "USB Hub",
      product_price: 25.99,
      customerId: 4,
    },
    {
      id: 25,
      purchase_date: 1711363200,
      product_name: "Portable SSD",
      product_price: 200.99,
      customerId: 5,
    },
    {
      id: 26,
      purchase_date: 1714041600,
      product_name: "Graphics Tablet",
      product_price: 280.89,
      customerId: 6,
    },
    {
      id: 27,
      purchase_date: 1716720000,
      product_name: "Stylus Pen",
      product_price: 35.75,
      customerId: 7,
    },
    {
      id: 28,
      purchase_date: 1719398400,
      product_name: "Surge Protector",
      product_price: 40.5,
      customerId: 8,
    },
    {
      id: 29,
      purchase_date: 1721980800,
      product_name: "Laptop Bag",
      product_price: 55.99,
      customerId: 9,
    },
    {
      id: 30,
      purchase_date: 1724659200,
      product_name: "Smartwatch",
      product_price: 250.0,
      customerId: 10,
    },
    {
      id: 31,
      purchase_date: 1700738000,
      product_name: "Portable Monitor",
      product_price: 220.99,
      customerId: 1,
    },
    {
      id: 32,
      purchase_date: 1703426000,
      product_name: "Desk Lamp",
      product_price: 40.75,
      customerId: 2,
    },
    {
      id: 33,
      purchase_date: 1706104400,
      product_name: "Ergonomic Mouse",
      product_price: 55.99,
      customerId: 3,
    },
    {
      id: 34,
      purchase_date: 1708782800,
      product_name: "Cable Organizer",
      product_price: 12.5,
      customerId: 4,
    },
    {
      id: 35,
      purchase_date: 1711374800,
      product_name: "Wi-Fi Extender",
      product_price: 85.49,
      customerId: 5,
    },
    {
      id: 36,
      purchase_date: 1714053200,
      product_name: "Bluetooth Speaker",
      product_price: 150.99,
      customerId: 6,
    },
    {
      id: 37,
      purchase_date: 1716731600,
      product_name: "Laptop Sleeve",
      product_price: 35.25,
      customerId: 7,
    },
    {
      id: 38,
      purchase_date: 1719400000,
      product_name: "Gaming Chair",
      product_price: 349.99,
      customerId: 8,
    },
    {
      id: 39,
      purchase_date: 1721982400,
      product_name: "Standing Desk",
      product_price: 300.89,
      customerId: 9,
    },
    {
      id: 40,
      purchase_date: 1724660800,
      product_name: "Noise Isolating Earbuds",
      product_price: 199.49,
      customerId: 10,
    },
    {
      id: 41,
      purchase_date: 1700739000,
      product_name: "Monitor Stand",
      product_price: 50.89,
      customerId: 1,
    },
    {
      id: 42,
      purchase_date: 1703436000,
      product_name: "Smart Light Bulb",
      product_price: 25.99,
      customerId: 2,
    },
    {
      id: 43,
      purchase_date: 1706114400,
      product_name: "Backup Battery",
      product_price: 99.99,
      customerId: 3,
    },
    {
      id: 44,
      purchase_date: 1708792800,
      product_name: "USB Microphone",
      product_price: 120.5,
      customerId: 4,
    },
    {
      id: 45,
      purchase_date: 1711384800,
      product_name: "Graphic Design Software",
      product_price: 349.49,
      customerId: 5,
    },
    {
      id: 46,
      purchase_date: 1714063200,
      product_name: "Webcam with Ring Light",
      product_price: 150.75,
      customerId: 6,
    },
    {
      id: 47,
      purchase_date: 1716741600,
      product_name: "Digital Notebook",
      product_price: 85.25,
      customerId: 7,
    },
    {
      id: 48,
      purchase_date: 1719410000,
      product_name: "Tablet Keyboard",
      product_price: 199.75,
      customerId: 8,
    },
    {
      id: 49,
      purchase_date: 1721992400,
      product_name: "Projector",
      product_price: 300.0,
      customerId: 9,
    },
    {
      id: 50,
      purchase_date: 1724670800,
      product_name: "Wireless Presenter",
      product_price: 35.55,
      customerId: 10,
    },
    {
      id: 51,
      purchase_date: 1700740000,
      product_name: "Pen Tablet",
      product_price: 125.49,
      customerId: 1,
    },
    {
      id: 52,
      purchase_date: 1703446000,
      product_name: "Bluetooth Adapter",
      product_price: 19.99,
      customerId: 2,
    },
    {
      id: 53,
      purchase_date: 1706124400,
      product_name: "Noise Cancelling Microphone",
      product_price: 189.49,
      customerId: 3,
    },
    {
      id: 54,
      purchase_date: 1708802800,
      product_name: "Adjustable Laptop Desk",
      product_price: 99.75,
      customerId: 4,
    },
    {
      id: 55,
      purchase_date: 1711394800,
      product_name: "VR Headset",
      product_price: 349.89,
      customerId: 5,
    },
    {
      id: 56,
      purchase_date: 1714073200,
      product_name: "Wireless Gaming Controller",
      product_price: 75.25,
      customerId: 6,
    },
    {
      id: 57,
      purchase_date: 1716751600,
      product_name: "Digital Frame",
      product_price: 65.49,
      customerId: 7,
    },
    {
      id: 58,
      purchase_date: 1719420000,
      product_name: "Travel Adapter",
      product_price: 45.99,
      customerId: 8,
    },
    {
      id: 59,
      purchase_date: 1722002400,
      product_name: "Gaming Headset",
      product_price: 249.0,
      customerId: 9,
    },
    {
      id: 60,
      purchase_date: 1724680800,
      product_name: "Power Strip",
      product_price: 35.0,
      customerId: 10,
    },
    {
      id: 61,
      purchase_date: 1700741000,
      product_name: "LED Desk Lamp",
      product_price: 60.99,
      customerId: 1,
    },
    {
      id: 62,
      purchase_date: 1703456000,
      product_name: "Streaming Camera",
      product_price: 199.99,
      customerId: 2,
    },
    {
      id: 63,
      purchase_date: 1706134400,
      product_name: "Portable Bluetooth Speaker",
      product_price: 89.25,
      customerId: 3,
    },
    {
      id: 64,
      purchase_date: 1708812800,
      product_name: "Smart Thermostat",
      product_price: 249.99,
      customerId: 4,
    },
    {
      id: 65,
      purchase_date: 1711404800,
      product_name: "Portable Projector",
      product_price: 299.0,
      customerId: 5,
    },
    {
      id: 66,
      purchase_date: 1714083200,
      product_name: "Keyboard Light",
      product_price: 29.49,
      customerId: 6,
    },
    {
      id: 67,
      purchase_date: 1716761600,
      product_name: "USB-C Hub",
      product_price: 25.75,
      customerId: 7,
    },
    {
      id: 68,
      purchase_date: 1719430000,
      product_name: "Ethernet Adapter",
      product_price: 15.5,
      customerId: 8,
    },
    {
      id: 69,
      purchase_date: 1722012400,
      product_name: "Portable SSD",
      product_price: 120.99,
      customerId: 9,
    },
    {
      id: 70,
      purchase_date: 1724690800,
      product_name: "Laser Pointer",
      product_price: 35.75,
      customerId: 10,
    },
    {
      id: 71,
      purchase_date: 1700742000,
      product_name: "Streaming Microphone",
      product_price: 159.89,
      customerId: 1,
    },
    {
      id: 72,
      purchase_date: 1703466000,
      product_name: "Noise-Cancelling Earbuds",
      product_price: 79.49,
      customerId: 2,
    },
    {
      id: 73,
      purchase_date: 1706144400,
      product_name: "Adjustable Monitor Stand",
      product_price: 50.99,
      customerId: 3,
    },
    {
      id: 74,
      purchase_date: 1708822800,
      product_name: "Gaming Monitor",
      product_price: 349.89,
      customerId: 4,
    },
    {
      id: 75,
      purchase_date: 1711414800,
      product_name: "Smart Pen",
      product_price: 45.0,
      customerId: 5,
    },
    {
      id: 76,
      purchase_date: 1714093200,
      product_name: "Portable Air Purifier",
      product_price: 199.25,
      customerId: 6,
    },
    {
      id: 77,
      purchase_date: 1716771600,
      product_name: "Phone Stabilizer",
      product_price: 129.49,
      customerId: 7,
    },
    {
      id: 78,
      purchase_date: 1719440000,
      product_name: "HDMI Splitter",
      product_price: 29.75,
      customerId: 8,
    },
    {
      id: 79,
      purchase_date: 1722022400,
      product_name: "Noise-Isolating Headphones",
      product_price: 249.99,
      customerId: 9,
    },
    {
      id: 80,
      purchase_date: 1724700800,
      product_name: "Gaming Keyboard",
      product_price: 75.99,
      customerId: 10,
    },
    {
      id: 81,
      purchase_date: 1727313600,
      product_name: "Laptop Cooling Pad",
      product_price: 39.99,
      customerId: 10,
    },
    {
      id: 82,
      purchase_date: 1729905600,
      product_name: "Portable Fan",
      product_price: 19.5,
      customerId: 11,
    },
    {
      id: 83,
      purchase_date: 1732584000,
      product_name: "Desktop Organizer",
      product_price: 25.75,
      customerId: 12,
    },
    {
      id: 84,
      purchase_date: 1735262400,
      product_name: "RGB Mousepad",
      product_price: 84.25,
      customerId: 30,
    },
    {
      id: 1123,
      purchase_date: 1727918400,
      product_name: "RGB Mousepad 2",
      product_price: 56.25,
      customerId: 30,
    },
    {
      id: 85,
      purchase_date: 1737854400,
      product_name: "Wireless Charging Stand",
      product_price: 45.9,
      customerId: 14,
    },
    {
      id: 86,
      purchase_date: 1740532800,
      product_name: "Laptop Backpack",
      product_price: 59.99,
      customerId: 15,
    },
    {
      id: 87,
      purchase_date: 1743124800,
      product_name: "Bluetooth Smartwatch",
      product_price: 199.49,
      customerId: 16,
    },
    {
      id: 88,
      purchase_date: 1745803200,
      product_name: "Power Bank 20000mAh",
      product_price: 49.99,
      customerId: 17,
    },
    {
      id: 89,
      purchase_date: 1748395200,
      product_name: "Ergonomic Keyboard",
      product_price: 99.99,
      customerId: 18,
    },
    {
      id: 90,
      purchase_date: 1751073600,
      product_name: "Adjustable Desk Lamp",
      product_price: 35.0,
      customerId: 19,
    },
    {
      id: 91,
      purchase_date: 1753752000,
      product_name: "Smart Light Bulb",
      product_price: 18.99,
      customerId: 20,
    },
    {
      id: 92,
      purchase_date: 1756344000,
      product_name: "Mini Projector",
      product_price: 120.99,
      customerId: 21,
    },
    {
      id: 93,
      purchase_date: 1759022400,
      product_name: "Computer Speakers",
      product_price: 65.5,
      customerId: 22,
    },
    {
      id: 94,
      purchase_date: 1761700800,
      product_name: "Gaming Mouse",
      product_price: 75.49,
      customerId: 23,
    },
    {
      id: 95,
      purchase_date: 1764292800,
      product_name: "Phone Docking Station",
      product_price: 89.75,
      customerId: 24,
    },
    {
      id: 96,
      purchase_date: 1766971200,
      product_name: "Bluetooth Headphones",
      product_price: 220.0,
      customerId: 25,
    },
    {
      id: 97,
      purchase_date: 1769563200,
      product_name: "Universal Adapter",
      product_price: 30.99,
      customerId: 26,
    },
    {
      id: 98,
      purchase_date: 1772241600,
      product_name: "Laptop Cooling Pad",
      product_price: 45.0,
      customerId: 27,
    },
    {
      id: 99,
      purchase_date: 1774833600,
      product_name: "Wired Headphones",
      product_price: 59.5,
      customerId: 28,
    },
    {
      id: 100,
      purchase_date: 1777512000,
      product_name: "Gaming Chair",
      product_price: 299.99,
      customerId: 29,
    },
    {
      id: 101,
      purchase_date: 1727918400,
      product_name: "Noise Cancelling Earbuds",
      product_price: 99.99,
      customerId: 30,
    },
    {
      id: 102,
      purchase_date: 1728508800,
      product_name: "Portable Speaker",
      product_price: 75.5,
      customerId: 10,
    },
    {
      id: 103,
      purchase_date: 1729108800,
      product_name: "Smart Thermostat",
      product_price: 130.0,
      customerId: 11,
    },
    {
      id: 104,
      purchase_date: 1729708800,
      product_name: "USB-C Hub",
      product_price: 49.99,
      customerId: 12,
    },
    {
      id: 105,
      purchase_date: 1730308800,
      product_name: "Wireless Mouse",
      product_price: 29.99,
      customerId: 13,
    },
    {
      id: 106,
      purchase_date: 1730908800,
      product_name: "HD Webcam",
      product_price: 89.95,
      customerId: 14,
    },
    {
      id: 107,
      purchase_date: 1731508800,
      product_name: "Noise-Canceling Headphones",
      product_price: 159.5,
      customerId: 15,
    },
    {
      id: 108,
      purchase_date: 1732108800,
      product_name: "Tablet Stand",
      product_price: 20.0,
      customerId: 16,
    },
    {
      id: 109,
      purchase_date: 1732708800,
      product_name: "Cordless Vacuum Cleaner",
      product_price: 249.99,
      customerId: 17,
    },
    {
      id: 110,
      purchase_date: 1733308800,
      product_name: "Smart Doorbell",
      product_price: 129.99,
      customerId: 18,
    },
    {
      id: 111,
      purchase_date: 1733908800,
      product_name: "Portable SSD",
      product_price: 89.99,
      customerId: 19,
    },
    {
      id: 112,
      purchase_date: 1734508800,
      product_name: "LED Monitor",
      product_price: 199.99,
      customerId: 20,
    },
    {
      id: 113,
      purchase_date: 1735108800,
      product_name: "Surge Protector",
      product_price: 25.49,
      customerId: 21,
    },
    {
      id: 114,
      purchase_date: 1735708800,
      product_name: "Gaming Controller",
      product_price: 49.99,
      customerId: 22,
    },
    {
      id: 115,
      purchase_date: 1736308800,
      product_name: "Smartphone Gimbal",
      product_price: 99.95,
      customerId: 23,
    },
    {
      id: 116,
      purchase_date: 1736908800,
      product_name: "Bluetooth Speaker",
      product_price: 55.0,
      customerId: 24,
    },
    {
      id: 117,
      purchase_date: 1737508800,
      product_name: "Smart Plug",
      product_price: 35.5,
      customerId: 25,
    },
    {
      id: 118,
      purchase_date: 1738108800,
      product_name: "External Hard Drive",
      product_price: 79.99,
      customerId: 26,
    },
    {
      id: 119,
      purchase_date: 1738708800,
      product_name: "Fitness Tracker",
      product_price: 119.99,
      customerId: 27,
    },
    {
      id: 120,
      purchase_date: 1739308800,
      product_name: "Wireless Charger",
      product_price: 49.99,
      customerId: 28,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the title correctly", () => {
    render(<TransactionPage />);
    const titleElement = screen.getByText(/Transactions/i);
    expect(titleElement).toBeInTheDocument();
  });

  test("renders the date fields and submit button", () => {
    render(<TransactionPage />);

    expect(screen.getByLabelText(/start month/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end month/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  //   displays data correctly after loading
  test("displays data correctly after loading", async () => {
    const mockStartMonth = dayjs().subtract(2, "month").startOf("month").unix();
    const mockEndMonth = dayjs().endOf("month").unix();

    ApiService.getCustomers.mockResolvedValue(mockCustomers);
    ApiService.getTransactionsByMonth.mockResolvedValue(mockTransactions);

    render(<TransactionPage />);

    await waitFor(() => {
      expect(ApiService.getTransactionsByMonth).toHaveBeenCalledWith(
        mockStartMonth,
        mockEndMonth
      );
    });
  });

  //   it("should display data in the table after loading", async () => {
  //     const mockStartMonth = dayjs().subtract(2, "month").startOf("month").unix();
  //     const mockEndMonth = dayjs().endOf("month").unix();
  //     // ApiService.getTransactionsByMonth.mockResolvedValue(mockTransactions);
  //     // ApiService.getCustomers.mockResolvedValue(mockCustomers);
  //     //   const container = render(<TransactionPage />);
  //     //   console.log(container.innerHTML);
  //     await waitFor(() => {
  //       ApiService.getTransactionsByMonth.toHaveBeenCalledWith(
  //         mockStartMonth,
  //         mockEndMonth
  //       );
  //     });
  //     //   // expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  //     //   // expect(screen.getByText("Product A")).toBeInTheDocument();
  //     //   // expect(screen.getByText("Product B")).toBeInTheDocument();
  //     //   // await waitFor(() => {
  //     //   // expect(screen.getByText("84.25")).toBeInTheDocument();
  //     //   // expect(screen.getByText("Nancy King")).toBeInTheDocument();
  //     //   // expect(screen.getByText("199.99")).toBeInTheDocument();
  //     //   // expect(screen.getByText("248")).toBeInTheDocument();
  //     //   // });
  //     render(<TransactionPage />);

  //     const submitButton = screen.getByRole("button", { name: /Submit/i });

  //     fireEvent.click(submitButton);

  //     // expect(submitButton).toHaveBeenCalledTimes(1);
  //     expect(screen.getByText("84")).toBeInTheDocument();

  //     // expect(screen.getByText("Olivia Evans")).toBeInTheDocument();
  //     // const startMonthInput = screen.getByPlaceholderText("Start Month");
  //     // const endMonthInput = screen.getByPlaceholderText("End Month");
  //     // const submitButton = screen.getByText("Submit");
  //     // // Set input values
  //     // fireEvent.change(startMonthInput, { target: { value: "2024-01" } });
  //     // fireEvent.change(endMonthInput, { target: { value: "2024-03" } });
  //     // // Click submit
  //     // fireEvent.click(submitButton);
  //     // // Wait for the data to load
  //     // await waitFor(() => screen.getByText("Item 1")); // Assuming "Item 1" is part of the fetched data
  //     // // Check if table is populated with data
  //     // expect(screen.getByText("Item 1")).toBeInTheDocument();
  //     // expect(screen.getByText("Item 2")).toBeInTheDocument();
  //   });

  it("should update the table data when a new date range is selected", async () => {
    ApiService.getTransactionsByMonth.mockResolvedValue(mockTransactions);
    ApiService.getCustomers.mockResolvedValue(mockCustomers);

    render(<TransactionPage />);

    await waitFor(() =>
      expect(ApiService.getTransactionsByMonth).toHaveBeenCalled()
    );

    const startMonthPicker = screen.getByLabelText(/Start Month/i);
    fireEvent.change(startMonthPicker, {
      target: { value: dayjs().subtract(3, "month") },
    });

    const submitButton = screen.getByRole("button", { name: /Submit/i });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(ApiService.getTransactionsByMonth).toHaveBeenCalledTimes(2)
    );
  });

  // displays NoDataFound if no data is returned
  test("displays NoDataFound if no data is returned", async () => {
    ApiService.getCustomers.mockResolvedValueOnce([]);
    ApiService.getTransactionsByMonth.mockResolvedValueOnce([]);

    render(<TransactionPage />);

    await waitFor(() => {
      expect(screen.getByText(/no data found/i)).toBeInTheDocument();
    });
  });

  //   it("renders the datatable after form submission", () => {
  //     render(<TransactionPage />);

  //     // Fill out the form
  //     const startMonthInput = screen.getByLabelText(/start month/i);
  //     const endMonthInput = screen.getByLabelText(/end month/i);
  //     const submitButton = screen.getByRole("button", { name: /submit/i });

  //     fireEvent.change(startMonthInput, { target: { value: 1727721000 } });
  //     fireEvent.change(endMonthInput, { target: { value: 1735669799 } });

  //     // Submit the form
  //     fireEvent.click(submitButton);

  //     // Check if the DataTable component is rendered
  //     expect(screen.getByTestId("datatable")).toHaveTextContent("Data Loaded");
  //   });

  //   test("renders the subtitle correctly", () => {
  //     render(<TransactionPage />);
  //     const subtitleElement = screen.getByText(
  //       /A reward program based on purchase/i
  //     );
  //     expect(subtitleElement).toBeInTheDocument();
  //   });
});
