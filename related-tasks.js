(function(){
  var RELATED_TASK_CLASS = 'jg-related-task';
  var PARENT_TASK_CLASS = 'jg-parent-task';
  var COLOR_INDEX_ATTRIBUTE = 'jg-color-index';

  var availableColors = [0,1,2,3,4,5];
  var usedColors = [];

  var flagRelatedStories = function(parentTaskId) {

    var storyBoxNodes = document.querySelectorAll('div.story');
    var settingColor = false;
    var removingColor = false;
    var colorIndex;

    [].forEach.call(storyBoxNodes, function(it){
      var parentLink = it.querySelector('.' + PARENT_TASK_CLASS);
      if(parentLink && parentLink.getAttribute('data-objid') === parentTaskId) {
        if (it.classList.contains(RELATED_TASK_CLASS)) {
          if(!removingColor) {
            removingColor = true;
            colorIndex = it.getAttribute(COLOR_INDEX_ATTRIBUTE);
            availableColors.unshift(colorIndex);
          }
          it.classList.remove(RELATED_TASK_CLASS);
          it.classList.remove(RELATED_TASK_CLASS + '-' + colorIndex);
          it.removeAttribute(COLOR_INDEX_ATTRIBUTE);
        } else {
          if(availableColors.length === 0) {
            return;
          }
          if(!settingColor) {
            settingColor = true;
            colorIndex = availableColors.shift();
          }
          it.classList.add(RELATED_TASK_CLASS);
          it.classList.add(RELATED_TASK_CLASS + '-' + colorIndex);
          it.setAttribute(COLOR_INDEX_ATTRIBUTE, colorIndex);
        }
      }
    });
  };

  setTimeout(function(){
    var storyBoxNodes = document.querySelectorAll('div.story');
    [].forEach.call(storyBoxNodes, function(it){
      it.addEventListener('dblclick', function(event) {
        var parentLink = it.querySelector('.' + PARENT_TASK_CLASS);
        if(parentLink) {
          var parentTaskId = parentLink.getAttribute('data-objid');
          flagRelatedStories(parentTaskId);
        }
      });
    });
  }, 2000);
})();
