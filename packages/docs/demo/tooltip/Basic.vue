<template>
  <div class="tooltip-base-box">
    <div class="row center">
      <er-tooltip
        class="box-item"
        content="Top Left prompts info"
        placement="top-start"
      >
        <er-button>top-start</er-button>
      </er-tooltip>
      <er-tooltip
        class="box-item"
        content="Top Center prompts info"
        placement="top"
      >
        <er-button>top</er-button>
      </er-tooltip>
      <er-tooltip
        class="box-item"
        content="Top Right prompts info"
        placement="top-end"
      >
        <er-button>top-end</er-button>
      </er-tooltip>
    </div>
    <div class="row">
      <er-tooltip
        class="box-item"
        content="Left Top prompts info"
        placement="left-start"
      >
        <er-button>left-start</er-button>
      </er-tooltip>
      <er-tooltip
        class="box-item"
        content="Right Top prompts info"
        placement="right-start"
      >
        <er-button>right-start</er-button>
      </er-tooltip>
    </div>
    <div class="row">
      <er-tooltip
        class="box-item"
        content="Left Center prompts info"
        placement="left"
      >
        <er-button class="mt-3 mb-3">left</er-button>
      </er-tooltip>
      <er-tooltip
        class="box-item"
        content="Right Center prompts info"
        placement="right"
      >
        <er-button>right</er-button>
      </er-tooltip>
    </div>
    <div class="row">
      <er-tooltip
        class="box-item"
        content="Left Bottom prompts info"
        placement="left-end"
      >
        <er-button>left-end</er-button>
      </er-tooltip>
      <er-tooltip
        class="box-item"
        content="Right Bottom prompts info"
        placement="right-end"
      >
        <er-button>right-end</er-button>
      </er-tooltip>
    </div>
    <div class="row center">
      <er-tooltip
        class="box-item"
        content="Bottom Left prompts info"
        placement="bottom-start"
      >
        <er-button>bottom-start</er-button>
      </er-tooltip>
      <er-tooltip
        class="box-item"
        content="Bottom Center prompts info"
        placement="bottom"
      >
        <er-button>bottom</er-button>
      </er-tooltip>
      <er-tooltip
        class="box-item"
        content="Bottom Right prompts info"
        placement="bottom-end"
      >
        <er-button>bottom-end</er-button>
      </er-tooltip>
    </div>
  </div>
</template>

<style>
.tooltip-base-box {
  width: 600px;
}
.tooltip-base-box .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tooltip-base-box .center {
  justify-content: center;
}
.tooltip-base-box .box-item {
  width: 110px;
  margin-top: 10px;
}
</style>
