(function ($) {
    $.fn.CommentPlugin = function (options) {
        var settings = $.extend({
            //require
            objectId: null,
            commentRefrenceTypeID: 1,
            postComment: '/api/Facility/PostComment',
            getCommentList: '/api/Facility/GetCommentListByID',

            currentRole: null


        }, options);

        var viewModel = undefined;
        var area = this;
        var tt = "";
        buildInterface();

        async function buildInterface() {

            await area.html(getTemplate());
            await getCommentList();


            area.find('#btnSendComment').click(function () {
                addComment();
            });
        }

        async function getCommentList() {

            loading("list-chat", true);

            $.ajax({
                url: settings.getCommentList + "?commentRefrenceTypeID=" + settings.commentRefrenceTypeID + '&refrenceID=' + settings.objectId,
                type: 'GET',
                success: function (data) {

                    if (data.length != 0) {

                        reverted = [...data].reverse();

                        createChatList(reverted);

                        loading("list-chat", false);

                    }
                    else {
                        area.find("#list-chat").html("هیچ نظری ثبت نشده است")
                    }

                },
                error: function (x, y, z) {
                    ivsAlert2('error', 'پیغام خطا', 'خطا در دریافت نظرات');


                }
            });
        }

        function createChatList(result) {

            ss = "";

            for (var i = 0; i < result.length; i++) {
                var str = ``;
                
                if (settings.currentRole == result[i].creatorRoleName) {
                    str = `
                        <div class="chat-content-rightside">
							<div class="d-flex">
								<div class="flex-grow-1 me-2">
									<p class="mb-0 chat-time text-end"> ${getPerianDateTime(result[i].creationTime)}</p>
									<div class="chat-right-msg mb-3">${result[i].body}</div>
								</div>
							</div>
						</div>

                    `;
                    ss += str;
                }
                else {
                    str = `

                        <div class="chat-content-leftside">
							<div class="d-flex">
								<i class="bx bx-user-circle" style="height:48px; width:48px; font-size:48px"></i>
								<div class="flex-grow-1 ms-2">
									<p class=" chat-time  mb-0">${getPerianDateTime(result[i].creationTime)}</p>
									<p class="chat-left-msg mb-0">${result[i].body}</p>
									<p class="mb-3 chat-time">${result[i].creatorFullName} - ${result[i].creatorRoleName}  </p>

								</div>
							</div>
						</div>
                    `;
                    ss += str;
                }



            }
            area.find('#list-chat').html(ss);

        }

        async function addComment() {

            if (area.find("#textComment").val() == "") {
                ivsAlert2('error', 'پیغام خطا', 'نظر بدون متن نمیتوان ارسال کرد');
                return;
            }

            loading("btn-send-tagA", true, true);

            var commentModel = {
                commentRefrenceTypeID: settings.commentRefrenceTypeID,
                refrenceID: settings.objectId,
                body: area.find("#textComment").val(),
                replyToCommentID: null
            }

            $.ajax({
                type: "post",
                url: settings.postComment,
                data: JSON.stringify(commentModel),
                contentType: "application/json;",
                success: async function (result) {

                    ivsAlert2('success', ' پیام موفقیت', 'نظر جدید با موفقیت ثبت شد');
                    await getCommentList();
                    area.find("#textComment").val("");
                    loading("btn-send-tagA", false, true);



                },
                error: function (ex, cc, bb) {
                    loading("btn-send-tagA", false, true);
                    if (ex.responseText.indexOf('authorized: Unauthorized') > -1) {
                        ivsAlert2('error', 'پیغام خطا', 'شما دسترسی لازم برای ارسال نظر را ندارید ');

                    }
                    else {
                        ivsAlert2('error', 'پیغام خطا', 'خطا در ارسال نظر');
                    }
                    console.log(ex);
                    console.log(bb);

                },
                complete: function (jqXHR) {

                }
            });



        }

        function getTemplate() {

            var ss = `
                 <style>
                     #list-chat{
                     position:inherit !important
                     }
                     .chat-footer{ position:unset !important}
                     .chat-content{
                         height:45vh
                     }
                     .chat-wrapper{
                      height:100%
                     }
                 </style>
              	<div class="chat-wrapper">
					<div class="chat-content " id="list-chat" style="margin-right: 0; padding-top: 15px; ">
						

					</div>
					<div class="chat-footer d-flex align-items-center" style="">
						<div class="flex-grow-1 pe-2">
							<div class="">
								<input type="text" class="form-control" id="textComment" placeholder="یک پیام بنویسید">
							</div>
						</div>
						<div id="btnSendComment" class="chat-footer-menu " title="ارسال" style="display: block;"> 
							<a style="transform: rotate(180deg);" id="btn-send-tagA" class="btn-success" href="javascript:;"><i class="fadeIn bx bx-send"></i></a>
						</div>
					</div>
				</div>
				<script>
					new PerfectScrollbar('.chat-content');
				</script>
            `;
            ss = minifyHtml(ss);

            return ss;
        }


        this.destroy = function () {
            if (settings.addTemplate) {
                area.html('');
            }
        };
        return this;
    }

}(jQuery));
