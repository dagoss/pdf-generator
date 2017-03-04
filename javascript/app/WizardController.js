import $ from 'jquery'
import Utils from './pdf-utils'
import styles from '../lib/styles'

export default function WizardController(model) {
  $(":input").change(validatePage);
  $("form").submit(validateForm);

  // wizard pages
  $(".page").each(function(i) {
    //$(this).attr("id", "p" + i)
  }).hide()
  $(".page:first").addClass("current").show();
  var prev = $("<button type='button' class='btn btn-default' id='prev'>&lt; Previous</button>").click(prevHandler);
  var next = $("<button type='button' class='btn btn-default' id='next'>Next &gt;</button>").click(nextHandler);
  $("#generate").before(prev).before(" ").before(next).before(" ");

  $('#generate').attr('type', 'button').click(generateHandler)

  // init
  validatePage();
  setInterval(checkFragment, 100);

  /** Current location fragment. */
  var hash = location.hash;

  function validateForm(event) {
    var target = event.target;
    for (var i = 0; i < target.elements.length; i++) {
      var elem = target.elements[i]
      if(elem.className === "required" && !elem.disabled) {
        var value;
        switch (elem.nodeName.toLowerCase()) {
          case "select":
            for (var k = 0; k < elem.options.length; k++) {
              if(elem.options[k].selected) {
                value = elem.options[k].value;
                break;
              }
            }
            break;
          default:
            value = elem.value;
        }
        if(value === "") {
          var label = getLabel(elem)
          alert("Required field " + label.toLowerCase() + " has no value")
          event.stopPropagation()
          event.preventDefault()
          return false
        }
      }
    }
    return true;
  }

  function validatePage() {
    var elements = $(".current .required:enabled");
    var valid = true;
    if(elements.filter(":radio, :checkbox").length > 0 && elements.filter(":checked").length == 0) {
      valid = false;
    }
    if(elements.find("option").length > 0 && elements.find("option:selected").length == 0) {
      value = true;
    }
    elements.filter(":text").each(function(i) {
      var elem = $(this);
      var value = elem.val();
      if(value === "") {
        valid = false;
      }
    });
    if(elements.filter(".invalid").length > 0) {
      valid = false;
    }

    if($(".current").prevAll(".page:first").length === 0) { // first page
      $("#prev").attr("disabled", true);
    } else {
      $("#prev").removeAttr("disabled");
    }

    if($(".current#p6").length !== 0) { // last page
      $("#next").attr("disabled", true);
      if(valid) {
        $("#generate").removeAttr("disabled");
      } else {
        $("#generate").attr("disabled", true);
      }
    } else if($(".current").nextAll(".page:first").length === 0) { // download page
      $("#next").attr("disabled", true);
      $("#generate").attr("disabled", true);
    } else {
      if(valid) {
        $("#next").removeAttr("disabled");
      } else {
        $("#next").attr("disabled", true);
      }
      $("#generate").attr("disabled", true);
    }
    //alert(valid);
    return true;
  }

  function getLabel(elem) {
    return $("label[for=" + elem.name + "]:first").text();
  }

  function generateHandler(event) {
    var n = $(".current").nextAll(".page:not(.disabled):first");
    $(".current").removeClass("current").hide();
    n.addClass("current").show();
    validatePage();
    setFragment();
    // FIXME
    readArguments();
    $(':input[name=json]').val(JSON.stringify(model))
    $('form#generate-plugin').submit();
  }

  function readArguments() {
    model.configuration.style = {}
    const types = _(styles.styles).map((f, k) => {
      return k
    }).uniq().value()
    const properties = _(styles.styles).map((f, k) => {
      return _.map(f, (v, p) => {
        return p
      })
    }).flatten().uniq().value()
    types.forEach((__type) => {
      let group = {}
      properties.forEach((__property) => {
        let v = $(`:input[name="${__property}.${__type}"]`).val()
        if(!!v) {
          switch (typeof styles.styles[__type][__property].default) {
            case 'boolean':
              group[__property] = (v === 'true')
              break
            case 'number':
              group[__property] = Number(v)
              break
            default:
              group[__property] = v
          }
        }
      })
      model.configuration.style[__type] = group
    })

    return model
  }

  /**
   * Previous page button handler.
   */
  function prevHandler(event) {
    var p = $(".current").prevAll(".page:not(.disabled):first");
    $(".current").removeClass("current").hide();
    p.addClass("current").show();
    validatePage();
    setFragment();
  }

  /**
   * Next page button handler.
   */
  function nextHandler(event) {
    var n = $(".current").nextAll(".page:not(.disabled):first");
    $(".current").removeClass("current").hide();
    n.addClass("current").show();
    validatePage();
    setFragment();
  }

  /** Set location fragment to current page. */
  function setFragment(i) {
    let hash = $(".current").attr("id");
    location.hash = hash;
  }

  /** Check if location fragment has changed and change page accordingly. */
  function checkFragment() {
    if(location.hash.substr(1) !== hash) {
      if(location.hash.substr(1) === "") {
        location.replace("#" + $(".page:first").attr("id"));
      }
      hash = location.hash.substr(1);
      $(".current").removeClass("current").hide();
      $("#" + hash).addClass("current").show();
      validatePage();
    }
  }

}
