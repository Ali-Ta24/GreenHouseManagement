var PersianRoleName = [

    { "NameRole": "Admin", "PersianRoleName": "ادمین" },

    { "NameRole": "Customer", "PersianRoleName": "متقاضی" },

    { "NameRole": "ThirdParty", "PersianRoleName": "کاربر ناظر" },

    { "NameRole": "Committee_User", "PersianRoleName": "کارشناس کمیته وجوه" },
    { "NameRole": "Committee_Admin", "PersianRoleName": "دبیر کمیته" },

    { "NameRole": "Committee_Department_User", "PersianRoleName": "کارشناس اداره کل تخصصی" },
    { "NameRole": "Committee_Department_Admin", "PersianRoleName": "مدیر کل اداره تخصصی" },
    { "NameRole": "Committee_Department_Manager", "PersianRoleName": "رئیس اداره تخصصی" },

    { "NameRole": "Secondary_Session_Members", "PersianRoleName": "اعضای کمیته فرعی" },
    { "NameRole": "Primary_Session_Members", "PersianRoleName": "اعضای کمیته اصلی" },
    { "NameRole": "Both_Sessions_Member", "PersianRoleName": "عضو هر دو کمیته" },

    { "NameRole": "Committee_FinancialOffice_User", "PersianRoleName": "کارشناس مالی کمیته" },
    { "NameRole": "Committee_FinancialOffice_Admin", "PersianRoleName": "مدیر مالی کمیته" },

    { "NameRole": "General_Department_Admin", "PersianRoleName": "رئیس اداره کل تامین و مهندسی تجهیزات" },
    { "NameRole": "General_Department_User", "PersianRoleName": "کارشناس اداره کل تامین و مهندسی تجهیزات" },
    { "NameRole": "General_Department_Manager", "PersianRoleName": "مدیر اداره کل تامین و مهندسی تجهیزات" },

    { "NameRole": "Supervisors1", "PersianRoleName": "ناظرین 1" },
    { "NameRole": "Supervisors2", "PersianRoleName": "ناظرین 2" },

];

function GetRoleName(item) {
    if (item == null || item == undefined)
        window.location = "/Account/Login";
    return PersianRoleName.find(ss => ss.NameRole === item).PersianRoleName;
}