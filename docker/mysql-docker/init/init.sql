-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Máy chủ: mysql:3306
-- Thời gian đã tạo: Th4 09, 2026 lúc 09:02 AM
-- Phiên bản máy phục vụ: 8.0.45
-- Phiên bản PHP: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `infoInvoice`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `invoices`
--

CREATE TABLE `invoices` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `tax_id` int DEFAULT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `inv_ref` varchar(100) DEFAULT NULL,
  `po_no` varchar(100) DEFAULT NULL,
  `inv_sub_total` decimal(18,2) DEFAULT '0.00',
  `inv_vat_rate` decimal(18,2) DEFAULT '0.00',
  `inv_disc_amount` decimal(18,2) DEFAULT '0.00',
  `inv_vat_amount` decimal(18,2) DEFAULT '0.00',
  `inv_total_amount` decimal(18,2) DEFAULT '0.00',
  `exch_cd` varchar(10) DEFAULT NULL,
  `exch_rt` decimal(18,2) DEFAULT '1.00',
  `paid_tp` varchar(50) DEFAULT NULL,
  `note` text,
  `hd_no` varchar(50) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `clsf_no` varchar(50) DEFAULT NULL,
  `spcf_no` varchar(50) DEFAULT NULL,
  `template_code` varchar(100) DEFAULT NULL,
  `bank_account` varchar(50) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `message` text,
  `sql_code` varchar(255) DEFAULT NULL,
  `invoice_no_res` varchar(50) DEFAULT NULL,
  `inv_date_res` datetime DEFAULT NULL,
  `sys_created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `invoice_type` tinyint(1) DEFAULT NULL,
  `transaction_id_old` varchar(100) DEFAULT NULL,
  `note_desc` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `invoices`
--

INSERT INTO `invoices` (`id`, `user_id`, `tax_id`, `transaction_id`, `inv_ref`, `po_no`, `inv_sub_total`, `inv_vat_rate`, `inv_disc_amount`, `inv_vat_amount`, `inv_total_amount`, `exch_cd`, `exch_rt`, `paid_tp`, `note`, `hd_no`, `created_date`, `clsf_no`, `spcf_no`, `template_code`, `bank_account`, `bank_name`, `status`, `message`, `sql_code`, `invoice_no_res`, `inv_date_res`, `sys_created_at`, `invoice_type`, `transaction_id_old`, `note_desc`) VALUES
(8, 1, 1, '94dfeca5-1ecb-4ce3-a4ee-4e0c686ce692', '', '', 90000000000.00, NULL, 0.00, 4500000000.00, 94500000000.00, 'VND', 1.00, 'TM', '', '0', '0001-01-01 00:00:00', NULL, NULL, NULL, '', '', 0, NULL, NULL, NULL, NULL, '2026-04-09 12:32:05', 1, NULL, NULL),
(9, 1, 1, 'a693d8c4-e320-4fc9-9693-fac203ab7f87', '1111', '', 90000000.00, NULL, 0.00, 9000000.00, 99000000.00, 'VND', 1.00, 'TM', '', '0', '0001-01-01 00:00:00', NULL, NULL, NULL, '', '', 0, NULL, NULL, NULL, NULL, '2026-04-09 13:16:43', 1, NULL, NULL),
(10, 1, 1, '186c5fa1-19e9-48af-805f-48e9f0a2a722', '12333', '', 3200000.00, NULL, 0.00, 320000.00, 3520000.00, 'VND', 1.00, 'TM', '', '1', '0001-01-01 00:00:00', NULL, NULL, NULL, '', '', 0, NULL, NULL, NULL, NULL, '2026-04-09 13:35:55', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `invoice_customers`
--

CREATE TABLE `invoice_customers` (
  `id` int NOT NULL,
  `invoice_id` int DEFAULT NULL,
  `cust_cd` varchar(50) DEFAULT NULL,
  `cust_nm` varchar(255) DEFAULT NULL,
  `cust_company` varchar(255) DEFAULT NULL,
  `tax_code` varchar(20) DEFAULT NULL,
  `cust_city` varchar(100) DEFAULT NULL,
  `cust_district` varchar(100) DEFAULT NULL,
  `cust_addrs` text,
  `cust_phone` varchar(20) DEFAULT NULL,
  `cust_bank_account` varchar(50) DEFAULT NULL,
  `cust_bank_name` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `email_cc` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `invoice_customers`
--

INSERT INTO `invoice_customers` (`id`, `invoice_id`, `cust_cd`, `cust_nm`, `cust_company`, `tax_code`, `cust_city`, `cust_district`, `cust_addrs`, `cust_phone`, `cust_bank_account`, `cust_bank_name`, `email`, `email_cc`) VALUES
(3, 8, '33', 'dffs', 'sfsdfds', '22', '', '', '', '', '', '', '', ''),
(4, 9, '12', 'rt', '', '12333', '', '', '', '', '', '', '', ''),
(5, 10, '1234', 'rưerwe', '', '1231234', '', '', '', '', '', '', '', '');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `invoice_items`
--

CREATE TABLE `invoice_items` (
  `id` int NOT NULL,
  `invoice_id` int DEFAULT NULL,
  `itm_cd` varchar(50) DEFAULT NULL,
  `itm_name` varchar(255) DEFAULT NULL,
  `itm_knd` varchar(50) DEFAULT NULL,
  `unit_nm` varchar(20) DEFAULT NULL,
  `qty` decimal(18,4) DEFAULT '0.0000',
  `unprc` decimal(18,2) DEFAULT '0.00',
  `amt` decimal(18,2) DEFAULT '0.00',
  `disc_rate` decimal(5,2) DEFAULT '0.00',
  `disc_amt` decimal(18,2) DEFAULT '0.00',
  `vat_rt` varchar(10) DEFAULT NULL,
  `vat_amt` decimal(18,2) DEFAULT '0.00',
  `total_amt` decimal(18,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `invoice_items`
--

INSERT INTO `invoice_items` (`id`, `invoice_id`, `itm_cd`, `itm_name`, `itm_knd`, `unit_nm`, `qty`, `unprc`, `amt`, `disc_rate`, `disc_amt`, `vat_rt`, `vat_amt`, `total_amt`) VALUES
(3, 8, '1', 'đấ', '1', 'Cái', 1.0000, 90000000000.00, 90000000000.00, 0.00, 0.00, '5', 4500000000.00, 94500000000.00),
(4, 9, '1', 'f', '1', 'Cái', 1.0000, 90000000.00, 90000000.00, 0.00, 0.00, '10', 9000000.00, 99000000.00),
(5, 10, '12', 'e', '1', 'Cái', 12.0000, 100000.00, 1200000.00, 0.00, 0.00, '10', 120000.00, 1320000.00),
(6, 10, '333', 'r', '1', 'Cái', 1.0000, 2000000.00, 2000000.00, 0.00, 0.00, '10', 200000.00, 2200000.00),
(7, 10, '123', 't', '1', 'Cái', 1.0000, 0.00, 0.00, 0.00, 0.00, '10', 0.00, 0.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `providers`
--

CREATE TABLE `providers` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `providers`
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
-- Cấu trúc bảng cho bảng `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `is_revoked` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tax_check_history`
--

CREATE TABLE `tax_check_history` (
  `id` int NOT NULL,
  `tax_code` varchar(20) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `address` text,
  `status_code` varchar(10) DEFAULT NULL,
  `status_name` varchar(50) DEFAULT NULL,
  `last_update_tax` varchar(50) DEFAULT NULL,
  `checked_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tax_ids`
--

CREATE TABLE `tax_ids` (
  `id` int NOT NULL,
  `ma_dvcs` varchar(50) NOT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `address` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `tax_ids`
--

INSERT INTO `tax_ids` (`id`, `ma_dvcs`, `company_name`, `address`, `created_at`) VALUES
(1, '0101234567', NULL, NULL, '2026-04-09 08:54:23');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tct_accounts`
--

CREATE TABLE `tct_accounts` (
  `id` int NOT NULL,
  `tax_code` varchar(50) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tct_invoices`
--

CREATE TABLE `tct_invoices` (
  `id` int NOT NULL,
  `tct_id` varchar(255) DEFAULT NULL,
  `invoice_type` tinyint(1) DEFAULT NULL,
  `hsgoc` varchar(50) DEFAULT NULL,
  `khmshdon` varchar(50) DEFAULT NULL,
  `khhdon` varchar(50) DEFAULT NULL,
  `shdon` varchar(50) DEFAULT NULL,
  `ngay_lap` datetime DEFAULT NULL,
  `tthai` varchar(10) DEFAULT NULL,
  `tbly` varchar(10) DEFAULT NULL,
  `mhdon` varchar(100) DEFAULT NULL,
  `nbmst` varchar(50) DEFAULT NULL,
  `nbten` varchar(255) DEFAULT NULL,
  `nbdchi` text,
  `nmmsf` varchar(50) DEFAULT NULL,
  `nmten` varchar(255) DEFAULT NULL,
  `nmdchi` text,
  `tgtthue` decimal(18,2) DEFAULT NULL,
  `tgtthe` decimal(18,2) DEFAULT NULL,
  `tgtttbso` decimal(18,2) DEFAULT NULL,
  `dvtte` varchar(10) DEFAULT NULL,
  `detail_json` json DEFAULT NULL,
  `xml_data` longtext,
  `sync_created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tct_sessions`
--

CREATE TABLE `tct_sessions` (
  `id` int NOT NULL,
  `account_id` int DEFAULT NULL,
  `session_token` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `email`, `status`, `created_at`) VALUES
(1, 'admin', '$2a$11$FnfGVf2VsCcCW4qyXG/SYOLlHYmVoExLJ875K3mQ.PujLhaqCdPZS', NULL, NULL, 1, '2026-04-09 08:54:23');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_access_configs`
--

CREATE TABLE `user_access_configs` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `tax_id` int NOT NULL,
  `provider_id` int NOT NULL,
  `provider_username` varchar(100) DEFAULT NULL,
  `provider_password` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `tenant_id` varchar(100) DEFAULT NULL,
  `api_key` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `user_access_configs`
--

INSERT INTO `user_access_configs` (`id`, `user_id`, `tax_id`, `provider_id`, `provider_username`, `provider_password`, `url`, `tenant_id`, `api_key`, `created_at`) VALUES
(1, 1, 1, 6, 'admin', '$2a$11$FnfGVf2VsCcCW4qyXG/SYOLlHYmVoExLJ875K3mQ.PujLhaqCdPZS', 'https://api.easyinvoice.vn', '', NULL, '2026-04-09 08:54:23');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_invoice_hdno` (`hd_no`),
  ADD KEY `fk_inv_user` (`user_id`),
  ADD KEY `fk_inv_tax` (`tax_id`);

--
-- Chỉ mục cho bảng `invoice_customers`
--
ALTER TABLE `invoice_customers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_cust_invoice` (`invoice_id`);

--
-- Chỉ mục cho bảng `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_item_invoice` (`invoice_id`);

--
-- Chỉ mục cho bảng `providers`
--
ALTER TABLE `providers`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_rt_user` (`user_id`);

--
-- Chỉ mục cho bảng `tax_check_history`
--
ALTER TABLE `tax_check_history`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `tax_ids`
--
ALTER TABLE `tax_ids`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ma_dvcs` (`ma_dvcs`);

--
-- Chỉ mục cho bảng `tct_accounts`
--
ALTER TABLE `tct_accounts`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `tct_invoices`
--
ALTER TABLE `tct_invoices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tct_inv_shdon` (`shdon`),
  ADD KEY `idx_tct_inv_nbmst` (`nbmst`);

--
-- Chỉ mục cho bảng `tct_sessions`
--
ALTER TABLE `tct_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tct_sess_account` (`account_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Chỉ mục cho bảng `user_access_configs`
--
ALTER TABLE `user_access_configs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_uac_user` (`user_id`),
  ADD KEY `fk_uac_tax` (`tax_id`),
  ADD KEY `fk_uac_provider` (`provider_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `invoice_customers`
--
ALTER TABLE `invoice_customers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `providers`
--
ALTER TABLE `providers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT cho bảng `tax_check_history`
--
ALTER TABLE `tax_check_history`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tax_ids`
--
ALTER TABLE `tax_ids`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `tct_accounts`
--
ALTER TABLE `tct_accounts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tct_invoices`
--
ALTER TABLE `tct_invoices`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tct_sessions`
--
ALTER TABLE `tct_sessions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `user_access_configs`
--
ALTER TABLE `user_access_configs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Ràng buộc đối với các bảng kết xuất
--

--
-- Ràng buộc cho bảng `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `fk_inv_tax` FOREIGN KEY (`tax_id`) REFERENCES `tax_ids` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_inv_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ràng buộc cho bảng `invoice_customers`
--
ALTER TABLE `invoice_customers`
  ADD CONSTRAINT `fk_cust_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD CONSTRAINT `fk_item_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `fk_rt_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `tct_sessions`
--
ALTER TABLE `tct_sessions`
  ADD CONSTRAINT `fk_tct_sess_account` FOREIGN KEY (`account_id`) REFERENCES `tct_accounts` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `user_access_configs`
--
ALTER TABLE `user_access_configs`
  ADD CONSTRAINT `fk_uac_provider` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_uac_tax` FOREIGN KEY (`tax_id`) REFERENCES `tax_ids` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_uac_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
