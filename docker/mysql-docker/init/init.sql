-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql:3306
-- Generation Time: Apr 08, 2026 at 04:53 PM
-- Server version: 8.0.45
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `infoInvoice`
--

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int NOT NULL,
  `session_id` int NOT NULL,
  `transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `inv_ref` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `po_no` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inv_sub_total` decimal(18,2) NOT NULL,
  `inv_vat_rate` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inv_disc_amount` decimal(18,2) DEFAULT '0.00',
  `inv_vat_amount` decimal(18,2) NOT NULL,
  `inv_total_amount` decimal(18,2) NOT NULL,
  `exch_cd` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'VND',
  `exch_rt` decimal(18,2) DEFAULT '1.00',
  `paid_tp` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `hd_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `clsf_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spcf_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `template_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_account` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `message` text COLLATE utf8mb4_unicode_ci,
  `cqt_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_no_res` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inv_date_res` datetime DEFAULT NULL,
  `sys_created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `invoice_type` tinyint DEFAULT '1' COMMENT '1: Gốc, 2: Thay thế, 3: Điều chỉnh',
  `transaction_id_old` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'ID của hóa đơn bị thay thế/điều chỉnh',
  `note_desc` text COLLATE utf8mb4_unicode_ci COMMENT 'Lý do thay thế hoặc điều chỉnh (trường note trong tài liệu)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `session_id`, `transaction_id`, `inv_ref`, `po_no`, `inv_sub_total`, `inv_vat_rate`, `inv_disc_amount`, `inv_vat_amount`, `inv_total_amount`, `exch_cd`, `exch_rt`, `paid_tp`, `note`, `hd_no`, `created_date`, `clsf_no`, `spcf_no`, `template_code`, `bank_account`, `bank_name`, `status`, `message`, `cqt_code`, `invoice_no_res`, `inv_date_res`, `sys_created_at`, `invoice_type`, `transaction_id_old`, `note_desc`) VALUES
(1, 5, 'TXN_20260331_001', 'INV-REF-999', 'PO-12345', 1000000.00, '10', 0.00, 100000.00, 1100000.00, 'VND', 1.00, 'CK', 'Test phát hành hóa đơn từ Postman', NULL, NULL, NULL, NULL, NULL, '123456789', 'Vietcombank', 0, NULL, NULL, NULL, NULL, '2026-03-31 18:14:27', 1, NULL, NULL),
(2, 6, 'TXN_REPLACE_20260331_002', 'REP-999', 'PO-REP-01', 2000000.00, '10', 0.00, 200000.00, 2200000.00, NULL, 0.00, 'CK', 'Thay thế do sai tên khách hàng trên hóa đơn cũ TXN_20260331_001', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, '2026-04-01 00:01:27', 2, 'TXN_20260331_001', 'Thay thế do sai tên khách hàng trên hóa đơn cũ TXN_20260331_001'),
(3, 6, 'TXN_ADJ_20260401_005', 'ADJ-REF-001', 'PO-12345', 500000.00, '10', 0.00, 50000.00, 550000.00, NULL, 0.00, 'CK', 'Điều chỉnh tăng đơn giá sản phẩm do phát sinh chi phí vận hành', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, '2026-04-01 00:03:09', 3, 'TXN_20260331_001', 'Điều chỉnh tăng đơn giá sản phẩm do phát sinh chi phí vận hành'),
(5, 6, '48fafae5-eaba-402e-9fa6-5ce6a0ea4971', '', '', 0.00, NULL, 0.00, 0.00, 0.00, 'VND', 1.00, 'TM', '', NULL, NULL, NULL, NULL, NULL, '', '', 0, NULL, NULL, NULL, NULL, '2026-04-04 00:25:25', 1, NULL, NULL),
(8, 11, '7a14041b-1f03-4e69-92d0-68bf0abd8d94', 'INV-REF-999', 'PO-12345', 1781.00, NULL, 0.00, 89.05, 1870.05, 'VND', 1.00, 'CK', 'Test phát hành hóa đơn từ Postman', NULL, NULL, NULL, NULL, NULL, '123456789', 'Vietcombank', 0, NULL, NULL, NULL, NULL, '2026-04-04 00:29:33', 1, NULL, NULL),
(9, 11, '1861226b-ca35-44bb-b37b-ee7a7bf1f500', '', '', 0.00, NULL, 0.00, 0.00, 0.00, 'VND', 1.00, 'TM', '', NULL, NULL, NULL, NULL, NULL, '', '', 0, NULL, NULL, NULL, NULL, '2026-04-07 23:26:38', 1, NULL, NULL),
(12, 11, 'dae31b29-f45a-459e-b2d3-6fbb22c974dd', '', '', 0.00, NULL, 0.00, 0.00, 0.00, 'VND', 1.00, 'TM', '', NULL, NULL, NULL, NULL, NULL, '', '', 0, NULL, NULL, NULL, NULL, '2026-04-07 23:37:58', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `invoice_customers`
--

CREATE TABLE `invoice_customers` (
  `id` int NOT NULL,
  `invoice_id` int NOT NULL,
  `cust_cd` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cust_nm` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cust_company` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tax_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cust_city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cust_district` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cust_addrs` text COLLATE utf8mb4_unicode_ci,
  `cust_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cust_bank_account` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cust_bank_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_cc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoice_customers`
--

INSERT INTO `invoice_customers` (`id`, `invoice_id`, `cust_cd`, `cust_nm`, `cust_company`, `tax_code`, `cust_city`, `cust_district`, `cust_addrs`, `cust_phone`, `cust_bank_account`, `cust_bank_name`, `email`, `email_cc`) VALUES
(1, 1, 'CUS001', 'Nguyễn Văn A', 'Công ty TNHH Giải Pháp AI', '0101234567', 'Hà Nội', 'Cầu Giấy', 'Số 1 Duy Tân', '0987654321', '987654321', 'BIDV', 'khachhang@gmail.com', 'ketoan@gmail.com'),
(2, 2, NULL, 'Công ty TNHH Giải Pháp Mới', NULL, '0109998887', NULL, NULL, 'Tầng 10, Keangnam, Hà Nội', NULL, NULL, NULL, 'khachhang_moi@gmail.com', NULL),
(3, 3, NULL, 'Nguyễn Văn A', NULL, '0101234567', NULL, NULL, 'Số 1 Duy Tân, Cầu Giấy, Hà Nội', NULL, NULL, NULL, 'khachhang@gmail.com', NULL),
(4, 5, '', '', '', '', '', '', '', '', '', '', '', ''),
(6, 8, 'CUS001', 'tttt', 'tttt', '', '', '', '', '', '', '', '', ''),
(7, 9, '', '', '', '', '', '', '', '', '', '', '', ''),
(8, 12, '', '', '', '', '', '', '', '', '', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
  `id` int NOT NULL,
  `invoice_id` int NOT NULL,
  `itm_cd` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `itm_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `itm_knd` int DEFAULT '1',
  `unit_nm` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qty` decimal(18,4) NOT NULL,
  `unprc` decimal(18,2) NOT NULL,
  `amt` decimal(18,2) NOT NULL,
  `disc_rate` decimal(5,2) DEFAULT '0.00',
  `disc_amt` decimal(18,2) DEFAULT '0.00',
  `vat_rt` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vat_amt` decimal(18,2) NOT NULL,
  `total_amt` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoice_items`
--

INSERT INTO `invoice_items` (`id`, `invoice_id`, `itm_cd`, `itm_name`, `itm_knd`, `unit_nm`, `qty`, `unprc`, `amt`, `disc_rate`, `disc_amt`, `vat_rt`, `vat_amt`, `total_amt`) VALUES
(1, 1, 'PROD01', 'Phần mềm quản lý hóa đơn', 1, 'Gói', 1.0000, 1000000.00, 1000000.00, 0.00, 0.00, '10', 100000.00, 1100000.00),
(2, 2, 'PROD_SOFT', 'Phần mềm ERP (Bản thay thế)', 1, NULL, 1.0000, 2000000.00, 2000000.00, 0.00, 0.00, '10', 200000.00, 2200000.00),
(3, 3, 'ADJ_FEE', 'Phí điều chỉnh tăng đơn giá', 1, 'Lần', 1.0000, 500000.00, 500000.00, 0.00, 0.00, '10', 50000.00, 550000.00),
(4, 5, 'PROD-7478', '', 1, 'Cái', 1.0000, 0.00, 0.00, 0.00, 0.00, '10', 0.00, 0.00),
(5, 8, 'PROD01', '4444', 1, 'Cái', 1.0000, 2343.00, 1781.00, 24.00, 562.00, '5', 89.00, 1870.00),
(6, 9, 'PROD-1191', '', 1, 'Cái', 1.0000, 0.00, 0.00, 0.00, 0.00, '10', 0.00, 0.00),
(7, 12, 'PROD-6559', '', 1, 'Cái', 1.0000, 0.00, 0.00, 0.00, 0.00, '10', 0.00, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `invoice_sessions`
--

CREATE TABLE `invoice_sessions` (
  `id` int NOT NULL,
  `provider_id` int NOT NULL,
  `url` varchar(255) NOT NULL,
  `ma_dvcs` varchar(50) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `api_key` varchar(255) DEFAULT NULL COMMENT 'ApiKey tích hợp cho M-Invoice'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `invoice_sessions`
--

INSERT INTO `invoice_sessions` (`id`, `provider_id`, `url`, `ma_dvcs`, `username`, `password`, `tenant_id`, `created_at`, `api_key`) VALUES
(5, 3, 'https://api.easyinvoice.vn', '0101234562', 'buu', '$2a$11$J2VInWnRS/bqyR1b6o.ohOXu7jjxdi2UfZW1vIKKmccUBTZp5J0nW', '', '2026-03-31 18:10:15', NULL),
(6, 1, 'https://api.easyinvoice.vn', '0101234567', 'admin_test', '$2a$11$nql8.RpmuAmuhwiwqOj9u.Pj/emURs8V0vhpqAozfSnVEF/FLTd52', '', '2026-04-04 00:25:02', NULL),
(8, 1, 'https://api.demoprovider.com', 'DV123', 'admin', '$2a$11$VbyoLc3nLB8AV/WtNz0nPeRoeFDbM8xbuEAalecvKu0lCAaZvkcSS', 'TN01', '2026-04-02 16:42:49', NULL),
(9, 1, '', '', 'admin_test', '$2a$11$kIG.ICPK5OgWTZ6cTf9PEuhvxWCAdPB5S0exok8YJcQ/M.uYaXJbi', '', '2026-04-02 23:20:51', NULL),
(10, 6, 'https://api.easyinvoice.vn', '', 'admin_test', '$2a$11$LrFT1ef9MYS9nnoQvwwl7Oe.nQr.Q3nlrqjB00c6TQFfji7LOBkgm', '0101234567', '2026-04-03 00:43:38', NULL),
(11, 6, 'https://api.easyinvoice.vn', '0101234567', 'admin_test', '$2a$11$Pk/24iECozZRbqFV6E1wXeLXk/.Y266RuN0AYXx2R9pVRwTLd6SUa', '', '2026-04-07 23:35:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `providers`
--

CREATE TABLE `providers` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `providers`
--

INSERT INTO `providers` (`id`, `name`) VALUES
(1, 'EasyInvoice'),
(3, 'FptInvoice'),
(4, 'MifiInvoice'),
(5, 'EHoaDon'),
(6, 'BkavInvoice'),
(7, 'MInvoice'),
(8, 'SInvoice'),
(9, 'WinInvoice');

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL,
  `session_id` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_revoked` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `session_id`, `token`, `expires_at`, `is_revoked`, `created_at`) VALUES
(1, 5, '34f1ddf9-1409-4138-b4d8-f6cee6b39b84', '2026-04-07 17:02:57', 0, '2026-03-31 17:02:57'),
(2, 5, '8f5bcb5d-6bde-4cb4-bd7e-bdae89ea7f57', '2026-04-07 17:45:00', 0, '2026-03-31 17:45:00'),
(3, 5, '0a16784f-181b-4846-8b61-ee2f355b17d5', '2026-04-07 17:46:05', 0, '2026-03-31 17:46:05'),
(4, 5, 'a0a2efc1-96a7-42b4-9607-799570fdf006', '2026-04-07 17:57:19', 0, '2026-03-31 17:57:19'),
(5, 5, '88cd4f63-cbf3-4105-9ad1-2f59fdaa2e70', '2026-04-07 18:10:16', 0, '2026-03-31 18:10:16'),
(6, 6, '26f3c5d4-0c26-4213-80cf-28a936c1cba1', '2026-04-07 23:59:17', 0, '2026-03-31 23:59:17'),
(7, 6, '1657aff6-c2e2-4ea5-b0fb-23c3e2cfa6c1', '2026-04-08 16:04:33', 0, '2026-04-01 16:04:33'),
(8, 6, '685175bd-b026-40e4-b0fb-4a1de7937351', '2026-04-09 16:37:01', 0, '2026-04-02 16:37:01'),
(9, 8, '76c6caf4-6ee1-497b-a57c-3e3a507cf93b', '2026-04-09 16:42:49', 0, '2026-04-02 16:42:49'),
(10, 6, '9e0d5298-f6e5-4341-bd2b-3635da415229', '2026-04-09 22:45:12', 0, '2026-04-02 22:45:12'),
(11, 6, '8fd31e55-54fc-428e-b1cc-24344a91972c', '2026-04-09 23:19:17', 0, '2026-04-02 23:19:17'),
(12, 9, '5e7aea51-1d7d-4272-87f9-9ae3ff261aee', '2026-04-09 23:20:51', 0, '2026-04-02 23:20:51'),
(13, 10, 'da5f5fbd-ab38-49de-9150-f71a543eef86', '2026-04-10 00:42:25', 0, '2026-04-03 00:42:25'),
(14, 10, '9aa51420-0600-4489-8a85-54d2254d146c', '2026-04-10 00:42:50', 0, '2026-04-03 00:42:50'),
(15, 10, 'ee28fe66-9de0-4fd3-9d3f-0734a52c97e7', '2026-04-10 00:43:38', 0, '2026-04-03 00:43:38'),
(16, 11, 'd47b4799-6487-4538-8b54-47713b2e2674', '2026-04-10 00:54:09', 0, '2026-04-03 00:54:09'),
(17, 6, '9f7c23f6-9af5-4477-a0b7-7194d4233b66', '2026-04-10 00:59:14', 0, '2026-04-03 00:59:14'),
(18, 11, '36694257-8e1d-430c-97f3-9645e1d0880d', '2026-04-10 01:03:14', 0, '2026-04-03 01:03:14'),
(19, 6, 'fcf41808-6628-47f2-acd1-88a4609003ab', '2026-04-11 00:15:14', 0, '2026-04-04 00:15:14'),
(20, 6, '80d6a5dc-52b3-4381-8336-50d7ee15a0e4', '2026-04-11 00:25:02', 0, '2026-04-04 00:25:02'),
(21, 11, '516602ae-578e-433a-bb9f-9d5aa607487a', '2026-04-11 00:26:46', 0, '2026-04-04 00:26:46'),
(22, 11, 'dbb024f4-09b4-4d0b-9abd-5e3636ff1a0a', '2026-04-14 23:25:21', 0, '2026-04-07 23:25:21'),
(23, 11, 'fb1db3c5-52d3-416d-9bb0-42ed6b59b38a', '2026-04-14 23:33:58', 0, '2026-04-07 23:33:58'),
(24, 11, 'f2b6c2c1-e9c5-4a63-bc17-3a585705a606', '2026-04-14 23:35:37', 0, '2026-04-07 23:35:37'),
(25, 11, '87f69da0-06f9-4416-a5b6-0081cebbded0', '2026-04-15 23:51:16', 0, '2026-04-08 23:51:16');

-- --------------------------------------------------------

--
-- Table structure for table `tax_check_history`
--

CREATE TABLE `tax_check_history` (
  `id` int NOT NULL,
  `session_id` int NOT NULL,
  `tax_code` varchar(20) NOT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `address` text,
  `status_code` varchar(10) DEFAULT NULL,
  `status_name` varchar(255) DEFAULT NULL,
  `last_update_tax` varchar(50) DEFAULT NULL,
  `checked_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tax_check_history`
--

INSERT INTO `tax_check_history` (`id`, `session_id`, `tax_code`, `company_name`, `address`, `status_code`, `status_name`, `last_update_tax`, `checked_at`) VALUES
(1, 6, '0101234567', 'Công ty Test 0101234567', 'Hà Nội, Việt Nam', '00', 'NNT đang hoạt động (đã được cấp GCN ĐKT)', '2026-04-01 16:04:53', '2026-04-01 16:04:53'),
(2, 6, '0312345678', 'Công ty Test 0312345678', 'Hà Nội, Việt Nam', '00', 'NNT đang hoạt động (đã được cấp GCN ĐKT)', '2026-04-01 16:04:53', '2026-04-01 16:04:53'),
(3, 6, '0109998887', 'Công ty Test 0109998887', 'Hà Nội, Việt Nam', '00', 'NNT đang hoạt động (đã được cấp GCN ĐKT)', '2026-04-01 16:04:53', '2026-04-01 16:04:53'),
(4, 11, '1231232131321', 'Công ty Test 1231232131321', 'Hà Nội, Việt Nam', '00', 'NNT đang hoạt động (đã được cấp GCN ĐKT)', '2026-04-07 23:26:11', '2026-04-07 23:26:11');

-- --------------------------------------------------------

--
-- Table structure for table `tct_accounts`
--

CREATE TABLE `tct_accounts` (
  `id` int NOT NULL,
  `tax_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã số thuế doanh nghiệp',
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tài khoản đăng nhập TCT',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mật khẩu TCT',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tct_invoices`
--

CREATE TABLE `tct_invoices` (
  `id` int NOT NULL,
  `tct_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ID của hóa đơn trên TCT',
  `invoice_type` tinyint(1) NOT NULL COMMENT '1: Hóa đơn mua vào, 2: Hóa đơn bán ra',
  `hsgoc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Hồ sơ gốc',
  `khmshdon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Ký hiệu mẫu số hóa đơn',
  `khhdon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Ký hiệu hóa đơn',
  `shdon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Số hóa đơn',
  `ngay_lap` datetime DEFAULT NULL COMMENT 'Ngày lập hóa đơn',
  `tthai` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Trạng thái hóa đơn (1..6)',
  `ttxly` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Tình trạng xử lý (5,6,8)',
  `mhdon` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mã số cơ quan thuế',
  `nbmst` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã số thuế người bán',
  `nbten` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Tên người bán',
  `nbdchi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Địa chỉ người bán',
  `nmmst` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mã số thuế người mua',
  `nmten` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Tên người mua',
  `nmdchi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Địa chỉ người mua',
  `tgtcthue` decimal(18,2) DEFAULT '0.00' COMMENT 'Tổng tiền trước thuế',
  `tgtthue` decimal(18,2) DEFAULT '0.00' COMMENT 'Tổng tiền thuế',
  `tgtttbso` decimal(18,2) DEFAULT '0.00' COMMENT 'Tổng tiền sau thuế',
  `dvtte` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'VND' COMMENT 'Loại tiền',
  `detail_json` json DEFAULT NULL COMMENT 'Lưu cục JSON chi tiết lấy từ API Bước C',
  `xml_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Lưu dữ liệu XML lấy từ API Bước D (có thể dài)',
  `sync_created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian record được đồng bộ về DB'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tct_sessions`
--

CREATE TABLE `tct_sessions` (
  `id` int NOT NULL,
  `account_id` int NOT NULL COMMENT 'ID của tct_accounts',
  `session_token` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Chuỗi session lấy từ TCT',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `expires_at` datetime NOT NULL COMMENT 'Hết hạn sau 24h'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transaction_id` (`transaction_id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indexes for table `invoice_customers`
--
ALTER TABLE `invoice_customers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- Indexes for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- Indexes for table `invoice_sessions`
--
ALTER TABLE `invoice_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_provider_mst` (`provider_id`,`ma_dvcs`);

--
-- Indexes for table `providers`
--
ALTER TABLE `providers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indexes for table `tax_check_history`
--
ALTER TABLE `tax_check_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indexes for table `tct_accounts`
--
ALTER TABLE `tct_accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_tax_code` (`tax_code`);

--
-- Indexes for table `tct_invoices`
--
ALTER TABLE `tct_invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_tct_id` (`tct_id`),
  ADD KEY `idx_invoice_type` (`invoice_type`),
  ADD KEY `idx_nbmst` (`nbmst`),
  ADD KEY `idx_nmmst` (`nmmst`);

--
-- Indexes for table `tct_sessions`
--
ALTER TABLE `tct_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_account_id` (`account_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `invoice_customers`
--
ALTER TABLE `invoice_customers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `invoice_sessions`
--
ALTER TABLE `invoice_sessions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `tax_check_history`
--
ALTER TABLE `tax_check_history`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tct_accounts`
--
ALTER TABLE `tct_accounts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tct_invoices`
--
ALTER TABLE `tct_invoices`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tct_sessions`
--
ALTER TABLE `tct_sessions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `invoice_sessions` (`id`);

--
-- Constraints for table `invoice_customers`
--
ALTER TABLE `invoice_customers`
  ADD CONSTRAINT `invoice_customers_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD CONSTRAINT `invoice_items_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invoice_sessions`
--
ALTER TABLE `invoice_sessions`
  ADD CONSTRAINT `invoice_sessions_ibfk_1` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`);

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `invoice_sessions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tax_check_history`
--
ALTER TABLE `tax_check_history`
  ADD CONSTRAINT `tax_check_history_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `invoice_sessions` (`id`);

--
-- Constraints for table `tct_sessions`
--
ALTER TABLE `tct_sessions`
  ADD CONSTRAINT `fk_tct_sessions_account` FOREIGN KEY (`account_id`) REFERENCES `tct_accounts` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
