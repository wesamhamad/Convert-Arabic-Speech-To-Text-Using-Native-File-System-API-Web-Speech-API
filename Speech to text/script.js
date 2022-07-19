var SpeechRecognition = window.webkitSpeechRecognition;

var recognition = new SpeechRecognition();
let saveHandle

var Textbox = $("#textarea");
var instructions = $("#instructions");

var Content = "";

recognition.continuous = true;

recognition.onresult = function (event) {
  var current = event.resultIndex;

  var transcript = event.results[current][0].transcript;

  Content += transcript;
  Textbox.val(Content);
};

$("#start").on("click", function (e) {
  if ($(this).text() == "إيقاف التسـجيل") {
    $(this).html("ابـدأ الـتـسـجـيـل");
    $("#instructions").html("");
    recognition.stop();
  } else {
    $(this).html("إيقاف التسـجيل");
    $("#instructions").html("بـدأ الـتـسـجـيـل");
    if (Content.length) {
      Content += " ";
    }
    recognition.start();
  }
});

$("#saveas").click(function (e) {
  saveText(Content);
});

async function saveText(content) {
  const opts = {
    type: "save-file",
    accepts: [
      {
        description: "Text file",
        extensions: ["txt"],
        mimeTypes: ["text/plain"],
      },
    ],
  };
  const handle = await window.chooseFileSystemEntries(opts);

  const writable = await handle.createWritable();
  // Write the contents of the file to the stream.
  await writable.write(content);
  // Close the file and write the contents to disk.
  await writable.close();
}

$("#load").click(function () {
    if($(this).html() == "حفظ التغييرات"){
        saveFile(saveHandle,Content)
    }else{
    $(this).html("حفظ التغييرات")
  loadFile();
    }
});
async function getNewFileHandle() {
  
  const handle = await window.chooseFileSystemEntries();
  return handle;
}
async function loadFile() {

  saveHandle = await getNewFileHandle()

  if(await verifyPermission(saveHandle,true)){
 
  // Request permission, if the user grants permission, return true.
    const file = await saveHandle.getFile();
    const contents = await file.text();
    console.log(contents);
    Content += contents;
    $("textarea").val(contents);
  }}

  async function saveFile(saveHandle,content){
    const writable = await saveHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(content);
    // Close the file and write the contents to disk.
    await writable.close();

    alert("تم حفظ تغييرات الملف")
  }

  async function verifyPermission(fileHandle, withWrite) {
    const opts = {};
    if (withWrite) {
      opts.writable = true;
    }
    // Check if we already have permission, if so, return true.
    if (await fileHandle.queryPermission(opts) === 'granted') {
      return true;
    }
    // Request permission to the file, if the user grants permission, return true.
    if (await fileHandle.requestPermission(opts) === 'granted') {
      return true;
    }
    // The user did nt grant permission, return false.
    return false;
  }

$("#clear").click(function () {
  Textbox.val("");
  $("#load").html("تـحـمـيـل مـلـف")
  Content = ""
  $("#start").html("ابـدأ الـتـسـجـيـل")
});

Textbox.on("input", function () {
  Content = $(this).val();
});