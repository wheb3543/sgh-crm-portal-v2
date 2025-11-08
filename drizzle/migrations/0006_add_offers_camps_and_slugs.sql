-- Add slug column to doctors table
ALTER TABLE doctors ADD COLUMN slug VARCHAR(255) NOT NULL UNIQUE AFTER specialty;

-- Create offers table
CREATE TABLE offers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description LONGTEXT,
  imageUrl VARCHAR(500),
  isActive BOOLEAN NOT NULL DEFAULT true,
  startDate TIMESTAMP NULL,
  endDate TIMESTAMP NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create camps table
CREATE TABLE camps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description LONGTEXT,
  imageUrl VARCHAR(500),
  startDate TIMESTAMP NULL,
  endDate TIMESTAMP NULL,
  isActive BOOLEAN NOT NULL DEFAULT true,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add sourceType and sourceId columns to leads table
ALTER TABLE leads ADD COLUMN sourceType ENUM('offer', 'doctor', 'camp', 'campaign') NOT NULL DEFAULT 'campaign' AFTER utmContent;
ALTER TABLE leads ADD COLUMN sourceId INT AFTER sourceType;

-- Create indexes for better query performance
CREATE INDEX idx_offers_slug ON offers(slug);
CREATE INDEX idx_offers_isActive ON offers(isActive);
CREATE INDEX idx_camps_slug ON camps(slug);
CREATE INDEX idx_camps_isActive ON camps(isActive);
CREATE INDEX idx_doctors_slug ON doctors(slug);
CREATE INDEX idx_leads_sourceType ON leads(sourceType);
CREATE INDEX idx_leads_sourceId ON leads(sourceId);
