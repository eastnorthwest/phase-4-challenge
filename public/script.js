$(document).ready(function() {
  Materialize.updateTextFields();
  $('textarea').characterCounter();
  $('#review-text').on('keyup change blur', () => {
    if ($('#review-text').val().length>=250) {
      $('#review-text').val($('#review-text').val().substr(0, 249))
      $('textarea').characterCounter();
    }
  })
  $('.modal').modal();
})