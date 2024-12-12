CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50),
    phone VARCHAR(50),
    password TEXT,
    imageID TEXT,
    systemID TEXT,
    notify JSON,
    messages JSON,
    repeatType TEXT,
    repeatValue DECIMAL(10, 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Verify (
    verifyId VARCHAR(40) PRIMARY KEY,
    code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Notify (
    id INT AUTO_INCREMENT PRIMARY KEY,
    systemID VARCHAR(40),
    title TEXT,
    caption TEXT,
    link TEXT,
    selectDay VARCHAR(50),
    selectTime VARCHAR(50),
    automate BOOLEAN
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

CREATE TABLE Event (
    id INT AUTO_INCREMENT PRIMARY KEY,
    systemID VARCHAR(50),
    title TEXT,
    content TEXT,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

CREATE TABLE Reminders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    systemID VARCHAR(50),
    admin VARCHAR(50),
    title TEXT,
    caption TEXT,
    selectDay VARCHAR(50),
    selectTime VARCHAR(50),
    repeatState TEXT,
    week DECIMAL(10, 0),
    day DECIMAL(10, 0),
    month DECIMAL(10, 0),
    year DECIMAL(10, 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

CREATE TABLE Admin (
    name VARCHAR(50),
    email VARCHAR(50),
    password TEXT,
    imageID TEXT,
    adminID VARCHAR(50),
    notify JSON,
    messages JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE Seen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    systemID VARCHAR(50),
    uid VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
)

INSERT INTO Admin (
    name,
    email,
    password,
    adminID
) VALUES (
    "Admin",
    "admin@cutlery.com",
    "$2y$10$/Z9hXTi8RFDnV/wqBLc22e8XpDI/7SU/EP1FrbAd.gq6WcFPBQ5oO",
    "9s4f2irhv035s61n0ce2loejcqrtj2vz38bzehx8"
)


CREATE TABLE Chat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    systemID VARCHAR(50),
    messages JSON ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

[
    {
        replyID 
        seen
        msg
        time_created
        userID
        userName
        userImage
    }
]