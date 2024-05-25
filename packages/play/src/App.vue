<script setup lang="ts">
import { ref, h, reactive } from "vue";
import {
  ErMessage,
  ErNotification,
  ErMessageBox,
  type RenderLabelFunc,
  // type ButtonType,
} from "eric-ui";

const openVal = ref(["a"]);
const loading = ref(false);
const dropdownOptions = ref([
  {
    label: "Option A",
    // name: 'a'
  },
  {
    label: "Option B",
    // name: 'b'
  },
  {
    label: "Option C",
    // name: 'c',
    divided: true,
  },
]);
const switchValue = ref(true);
const inputValue = ref("");
const selectValue = ref("");
const selectOptions = ref([
  {
    label: "Option A",
    value: "a",
  },
  {
    label: "Option B",
    value: "b",
  },
  {
    label: "Option C",
    value: "c",
    disabled: true,
  },
]);
const customOptionRender: RenderLabelFunc = (opt) => {
  return h("div", null, [
    h("b", { style: { color: "red" } }, opt.label),
    h("span", null, `~${opt.value}`),
  ]);
};

const formRef = ref();
const formData = reactive({
  email: "123",
  password: "",
  confirmPwd: "",
});
const formRules: any = {
  email: [{ type: "email", required: true, trigger: "blur" }],
  password: [
    { type: "string", required: true, trigger: "blur", min: 3, max: 5 },
  ],
  confirmPwd: [
    { type: "string", required: true, trigger: "blur" },
    {
      validator: (_: typeof formRules, value: string) =>
        value === formData.password,
      trigger: "blur",
      message: "两个密码必须相同",
    },
  ],
};

function handleBtnClick() {
  ErMessage.info("Button Click");
}

function handleNotify() {
  ErNotification({
    title: "Title",
    message: "Message",
    type: "success",
  });
}

setInterval(() => {
  loading.value = !loading.value;
  // let loadingHandle = ErLoading.service();
  // if (loading.value) {
  //   loadingHandle = ErLoading.service();
  // } else {
  //   loadingHandle?.close();
  // }
}, 2000);

async function submit() {
  try {
    await formRef.value.validate();
    console.log("passed!");
  } catch (e) {
    console.log("the error", e);
  }
}

function callMessageBox() {
  ErMessageBox.confirm("确认删除吗？", "确认消息", {
    title: "标题",
    type: "warning",
    showClose: true,
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    callback: (action) => {
      console.log(action);
    },
    beforeClose(action, instance, next) {
      if (action === "confirm") {
        instance.confirmButtonLoading = true;
        instance.confirmButtonText = "删除中...";
        setTimeout(() => {
          next();
        }, 2000);
      } else {
        next();
      }
    },
  });
}
</script>

<template>
  <div>
    <p>
      <er-button @click="handleBtnClick" :use-throttle="false"
        >Default</er-button
      >
      <er-button type="primary" @click="handleNotify">Primary</er-button>
      <er-button type="success" @click="console.log('click')"
        >Success</er-button
      >
      <er-button type="info" @click="callMessageBox">Info</er-button>
      <er-button type="warning">Warning</er-button>
      <er-popconfirm title="Are you sure to delete this?">
        <er-button type="danger">Danger</er-button>
      </er-popconfirm>
    </p>
    <p>
      <er-button plain>Plain</er-button>
      <er-button type="primary" plain>Primary</er-button>
      <er-button type="success" plain>Success</er-button>
      <er-button type="info" plain>Info</er-button>
      <er-button type="warning" plain>Warning</er-button>
      <er-button type="danger" plain>Danger</er-button>
    </p>
    <p>
      <er-button round>Round</er-button>
      <er-button type="primary" round>Primary</er-button>
      <er-button type="success" round>Success</er-button>
      <er-button type="info" round>Info</er-button>
      <er-button type="warning" round loading>Warning</er-button>
      <er-button type="danger" round>Danger</er-button>
    </p>
    <p>
      <er-button icon="search" circle />
      <er-button type="primary" icon="edit" circle />
      <er-button type="success" icon="check" circle />
      <er-button type="info" icon="message" circle />
      <er-button type="warning" icon="star" circle />
      <er-button type="danger" icon="trash" circle />
    </p>
    <p>
      <er-button-group size="small" type="primary">
        <er-button round>Round</er-button>
        <er-button type="primary" round>Primary</er-button>
        <er-button type="success" round>Success</er-button>
        <er-button type="info" round>Info</er-button>
        <er-button type="warning" round loading>Warning</er-button>
        <er-button type="danger" round>Danger</er-button>
      </er-button-group>
    </p>
    <er-collapse v-model="openVal" accordion>
      <er-collapse-item name="a" title="Title a">
        <h1>headline title</h1>
        <div>this is content a</div>
      </er-collapse-item>
      <er-collapse-item name="b" title="title b">
        <div>this is content b</div>
      </er-collapse-item>
      <er-collapse-item name="c" title="title c  disable" disabled>
        <div>this is content c</div>
      </er-collapse-item>
    </er-collapse>
  </div>

  <er-dropdown :items="dropdownOptions" size="small" split-button
    >dropdown</er-dropdown
  >
  <er-tooltip
    ref="tooltipRef"
    placement="right-end"
    trigger="contextmenu"
    :popper-options="{ placement: 'right-end', strategy: 'fixed' }"
  >
    <er-button icon="arrow-up">tooltip</er-button>
    <template #content> 弹出部分 </template>
  </er-tooltip>
  <er-input v-model="inputValue" placeholder="请输入内容">
    <template #suffix> <button>test</button> </template>
    <template #append> test1</template>
  </er-input>
  <er-switch
    v-model="switchValue"
    size="large"
    active-text="ON"
    inactive-text="OFF"
  />
  <er-select
    v-model="selectValue"
    placeholder="请选择"
    :render-label="customOptionRender"
    :options="selectOptions"
    clearable
    filterable
  >
    <er-option label="opt 1" value="1" />
    <er-option label="opt 2" value="2" />
    <span>a</span>
    <er-option label="opt 3" value="3" disabled />
    <er-option label="opt 4" value="4">
      <span style="color: green">opt 4</span>
    </er-option>
  </er-select>

  <er-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    label-suffix=":"
    er-loading-text="loading..."
    er-loading-spinner="circle-notch"
    @submit="submit"
  >
    <er-form-item label="email" prop="email" disabled>
      <er-input v-model="formData.email" clearable />
    </er-form-item>
    <er-form-item label="password" prop="password">
      <er-input v-model="formData.password" type="password" />
    </er-form-item>
    <er-form-item
      label="confirm password"
      prop="confirmPwd"
      :rules="[
        {
          required: true,
          trigger: 'test',
          message: '测试自定义触发',
        },
      ]"
    >
      <template #default="{ validate: _validate }">
        <er-input v-model="formData.confirmPwd" type="password" />
        <button @click.prevent="_validate('test')">vli</button>
      </template>
    </er-form-item>
    <div style="text-align: center">
      <er-button type="primary" native-type="submit">Submit</er-button>
    </div>
  </er-form>

  <er-alert title="title" type="success" show-icon />
  <er-alert title="title" description="description" type="warning" show-icon />
  <er-alert title="title" description="description" type="danger" show-icon />
  <er-alert title="title" description="description" type="info" show-icon />

  <er-upload
    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    :default-file-list="[
      {
        uid: '123',
        size: 123,
        name: 'test.png',
        status: 'uploading',
        percent: 20,
      },
      {
        uid: '124',
        size: 123,
        name: 'test1.png',
        status: 'success',
        percent: 100,
      },
      {
        uid: '125',
        size: 123,
        name: 'test4.png',
        status: 'error',
        percent: 34,
      },
    ]"
  >
    <er-button type="success" round icon="upload"> 上传文件 </er-button>
  </er-upload>
</template>
