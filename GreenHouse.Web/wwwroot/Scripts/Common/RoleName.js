var PersianRoleName = [

    { "NameRole": "Admin", "PersianRoleName": "ادمین" },

    { "NameRole": "Customer", "PersianRoleName": "گلخانه دار" },

];

function GetRoleName(item) {
    if (item == null || item == undefined)
        window.location = "/Account/Login";
    return PersianRoleName.find(ss => ss.NameRole === item).PersianRoleName;
}