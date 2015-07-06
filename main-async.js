(function(){
  
  
  var storyBoxInsertObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var listLength = mutation.addedNodes.length;
      for(var i = 0; i < listLength; i++) {
        var addedNode = mutation.addedNodes[i];
        if(addedNode.classList.contains('story')) {
          window.MwWorkfront.loadParentTask(addedNode);
        }
      }
    });
  });
//  storyBoxInsertObserver.observe(document.querySelector('body'),  { attributes: true, childList: true, characterData: true });
  
  var containerInsertObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var listLength = mutation.addedNodes.length;
      for(var i = 0; i < listLength; i++) {
        var addedNode = mutation.addedNodes[i];
        if(addedNode.tagName === 'DIV') {
          addedNode.style.border = '5px solid red';
        }
      }
    });
  });
  containerInsertObserver.observe(document.querySelector('body'),  { attributes: true, childList: true, characterData: true });

  
})();
