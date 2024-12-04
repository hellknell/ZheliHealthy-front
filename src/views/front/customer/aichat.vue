<template>
  <div class="common-layout">
    <el-container style="height:100%;width:100%;margin: 0 auto;">
      <el-header style="height: 50px; width: 100% ;background-color:rgba(0,102,255,.06)">
        <p class="centered-text">AI-历史人物</p>
      </el-header>
      <el-main id="chat">
        <chat v-for="item in form.msgList" :msg=item></chat>
      </el-main>
      <el-row style="margin: 0 auto;padding-left: 20px;padding-right: 20px;">
        <div style="width: 100%;">
          <el-input style="float: left;width: 90%;" @keyup.enter="sendMsg" v-model="form.input"></el-input>
          <el-button @click="sendMsg" style="float: right; height: 42px;line-height: 42px;" >发送</el-button>
        </div>
        <div style="margin: 0 auto;">
          <p style="color: red;font-size: 11px;">
            服务生成的所有内容均由人工智能模型生成，其生成内容的准确性和完整性无法保证，不代表我们的态度或观点
          </p>
        </div>
      </el-row>
    </el-container>
  </div>
</template>
<script setup>
import {nextTick, reactive} from 'vue'
import chat from '../../../components/chat.vue'
const form = reactive({
  input: '',//输入
  msgList:[] //消息列表
})
async function sendMsg()
{
  var keyword=form.input;
  if(form.input.length>0)
  {
    var msg={
      question:keyword,
      answer:"AI生成中..."
    };
    form.msgList.push(msg);

    form.input="";
    setScrollToBottom();
    const response=await fetch('/chat',{
      method:"post",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        question:keyword
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const reader = response.body.getReader();
    let decoder = new TextDecoder();
    let resultData = '';

    var str="";

    msg={
      question:keyword,
      answer:str
    };
    form.msgList.pop();
    form.msgList.push(msg);
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      resultData = decoder.decode(value);
      console.log(resultData);
      str+=resultData;
      msg={
        question:keyword,
        answer:str
      };
      form.msgList.pop();
      form.msgList.push(msg);
      setScrollToBottom();
    }
  }
}

/*内容显示过多时自动滑动*/
async function setScrollToBottom() {
  await nextTick()
  let chat = document.querySelector("#chat")
  chat.scrollTop = chat.scrollHeight
}

</script>
<style>
.common-layout{
  height: 100%;
}
#chat{
  height: calc(100vh - 300px);
}
.el-input{
  height: 45px;
  border-radius: 12px;
  box-sizing: border-box;
}
</style>
