(function(){
  
  var flagRelatedStories = function(parentTaskId) {
    var markedBoxNodes = document.querySelectorAll('div.jg-related-task');
    [].forEach.call(markedBoxNodes, function(it){
      it.classList.remove('jg-related-task');
    });
    
    var storyBoxNodes = document.querySelectorAll('div.story');
    [].forEach.call(storyBoxNodes, function(it){
      var parentLink = it.querySelector('.jg-parent-task');
      if(parentLink && parentLink.getAttribute('data-objid') === parentTaskId) {
        it.classList.add('jg-related-task');
      }
    });
  };
  
  setTimeout(function(){
    var storyBoxNodes = document.querySelectorAll('div.story');
    [].forEach.call(storyBoxNodes, function(it){
      it.addEventListener('click', function(event) {
        if(event.altKey) {
          var parentLink = it.querySelector('.jg-parent-task');
          if(parentLink) {
            var parentTaskId = parentLink.getAttribute('data-objid');
            flagRelatedStories(parentTaskId);
          }
        }
      });
    });
  }, 2000);
})();