
//idElement:string
//status:true/false
//isBtn:true/false
function loading(idElement, status, isBtn = false) {
    var loadigBox = `<div id="myLoading" class="card-overlay-loading"><span class="mySpinner"></span></div>`;
    var loadingBoxBtn = `<span id="myLoadingBtn" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
    
    if (isBtn) {
        if (status === true) {
            if (document.querySelector(`#${idElement} #myLoadingBtn`) == undefined) {
                $(`#${idElement}`).prepend(loadingBoxBtn);
                $(`#${idElement}`).prop('disabled', true);
            }
        }
        else if (status === false) {
            $(`#${idElement}`).prop('disabled', false);
            $(`#${idElement} #myLoadingBtn`).remove();
        }
    }  
    else {
        if (status === true) {
            document.getElementById(idElement).style.overflow = "hidden";
            document.getElementById(idElement).style.position = "relative";
            $(`#${idElement}`).prop('disabled', true);

            if (document.querySelector(`#${idElement} #myLoading`) == undefined) {
                $(`#${idElement}`).prepend(loadigBox);
            }
        }
        else if (status === false) {
            document.getElementById(idElement).style.overflow = "unset";
            document.getElementById(idElement).style.position = "unset";
            $(`#${idElement}`).prop('disabled', false);

            $(`#${idElement} #myLoading`).remove();
        }
    }


}

function loadingClass(ClassElement, status, isBtn = false) {
    var loadigBox = `<div id="myLoading" class="card-overlay-loading"><span class="mySpinner"></span> لطفا منتظر بمانید</div>`;
    var loadingBoxBtn = `<span id="myLoadingBtn" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

    if (isBtn) {
        if (status === true) {
            if (document.querySelector(`.${ClassElement} #myLoadingBtn`) == undefined) {
                $(`.${ClassElement}`).prepend(loadingBoxBtn);
                $(`.${ClassElement}`).prop('disabled', true);
            }
        }
        else if (status === false) {
            $(`.${ClassElement}`).prop('disabled', false);
            $(`.${ClassElement} #myLoadingBtn`).remove();
        }
    }
    else {
        if (status === true) {
            $('.' + ClassElement).last().css('overflow','hidden');
            $('.' + ClassElement).last().css('position','relative');
            $(`.${ClassElement}`).prop('disabled', true);

            if (document.querySelector(`.${ClassElement} #myLoading`) == undefined) {
                $(`.${ClassElement}`).prepend(loadigBox);
            }
        }
        else if (status === false) {
            $('.' + ClassElement).last().css('overflow', 'unset');
            $('.' + ClassElement).last().css('position', 'unset');
            
            $(`.${ClassElement}`).prop('disabled', false);

            $(`.${ClassElement} #myLoading`).remove();
        }
    }

}

function loadingPlugin(areaBtn, status) {
    var loadingBoxBtn = `<span id="myLoadingBtn" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
    
    var areaId = areaBtn.prevObject[0].id;

    var btnId = areaBtn[0].id;


    if (status === true) {
        if (document.querySelector(`#${areaId} #${btnId} #myLoadingBtn`) == undefined) {
            $(`#${areaId} #${btnId}`).prepend(loadingBoxBtn);
            $(`#${areaId} #${btnId}`).prop('disabled', true);
        }
    }
    else if (status === false) {
        $(`#${areaId} #${btnId}`).prop('disabled', false);
        $(`#${areaId} #${btnId} #myLoadingBtn`).remove();
    }
   
}