$(".dropdown-menu").css('height', $(window).height()-$('#mainHeader').height()-$('#mainNav').height());
      $(document).ready(function(){
            $(window).scroll(function(){
                  if ($(window).scrollTop() > 70){
                        //$('.ufo').css('right','800px');
                        $( "nav" ).addClass( "stick" );
                        //$(".navbar-brand").css('display','block');
                        $( ".navbar-brand" ).css('display','block');
                        $( "#memberplayNav span" ).css('display','block');
                        $( ".navbar-header .fa-play-circle" ).css('display','block');
                  }
                  if ($(window).scrollTop() < 70){
                        //$('.ufo').css('right','800px');
                        $( "nav" ).removeClass( "stick" );
                        //$(".navbar-brand").css('display','none');
                        $( ".navbar-brand" ).css('display','none');
                        $( "#memberplayNav span" ).css('display','none');
                        $( ".navbar-header .fa-play-circle" ).css('display','none');
                  }
                  });
                  });
                  $(".navbar-nav a").click(function() {
                  /*(if ($('.navbar-nav .active a').html() == "Places to Go "){
                  $(this).css('color', 'red !important');
                  alert("fewuhfrw");
                  }; */
                  if($(this).parent().hasClass('active')){
                        $(this).parent().removeClass('active');
                  }else{
                        $(this).parent().addClass('active').siblings().removeClass('active');
                  }
            });
            jQuery(document).on('click', '.mega-dropdown', function(e) {
            e.stopPropagation()
      });
            /*if($('.navbar-nav .active a').text() == "Places to Go"){
            $('.navbar-nav .active a').css('color', 'red');
            alert("fewuhfrw");
            }*/