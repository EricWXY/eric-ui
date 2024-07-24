<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick, type Ref } from "vue";
import { isFunction, isNil } from "lodash-es";
import type { MessageBoxProps, MessageBoxAction } from "./types";
import type { InputInstance } from "../Input/types";

import ErOverlay from "../Overlay/Overlay.vue";
import ErIcon from "../Icon/Icon.vue";
import ErButton from "../Button/Button.vue";
import ErInput from "../Input/Input.vue";

import { useId, useZIndex } from "@eric-ui/hooks";
import { typeIconMap } from "@eric-ui/utils";

defineOptions({ name: "ErMessageBox", inheritAttrs: false });

const props = withDefaults(defineProps<MessageBoxProps>(), {
  lockScroll: true,
  showClose: true,
  closeOnClickModal: true,
  confirmButtonType: "primary",
  roundButton: false,
  boxType: "",
  inputValue: "",
  inputPlaceholder:'Please input...',
  confirmButtonText: "Ok",
  cancelButtonText: "Cancel",
  showConfirmButton: true,
});
const { doAction } = props;

const headerRef = ref<HTMLElement>();
const inputRef = ref<InputInstance>();

const inputId = useId();
const { nextZIndex } = useZIndex();

const state = reactive({
  ...props,
  zIndex: nextZIndex(),
});

const hasMessage = computed(() => !!state.message);
const iconComponent = computed(
  () => state.icon ?? typeIconMap.get(state.type ?? "")
);

watch(
  () => props.visible?.value,
  (val) => {
    if (val) state.zIndex = nextZIndex();

    if (props.boxType !== "prompt") return;

    if (!val) return;

    nextTick(() => {
      inputRef.value && inputRef.value.focus();
    });
  }
);

function handleWrapperClick() {
  props.closeOnClickModal && handleAction("close");
}

function handleInputEnter(e: KeyboardEvent) {
  if (state.inputType === "textarea") return;
  e.preventDefault();
  return handleAction("confirm");
}

function handleAction(action: MessageBoxAction) {
  isFunction(props.beforeClose)
    ? props.beforeClose(action, state, () => doAction(action, state.inputValue))
    : doAction(action, state.inputValue);
}

function handleClose() {
  handleAction("close");
}
</script>

<template>
  <transition name="fade-in-linear" @after-leave="destroy">
    <er-overlay v-show="(visible as Ref).value" :z-index="state.zIndex" mask>
      <div
        role="dialog"
        class="er-overlay-message-box"
        @click="handleWrapperClick"
      >
        <div
          ref="rootRef"
          :class="[
            'er-message-box',
            {
              'is-center': state.center,
            },
          ]"
          @click.stop
        >
          <div
            v-if="!isNil(state.title)"
            ref="headerRef"
            class="er-message-box__header"
            :class="{ 'show-close': state.showClose }"
          >
            <div class="er-message-box__title">
              <er-icon
                v-if="iconComponent && state.center"
                :class="{
                  [`er-icon-${state.type}`]: state.type,
                }"
                :icon="iconComponent"
              />
              {{ state.title }}
            </div>
            <button
              v-if="showClose"
              class="er-message-box__header-btn"
              @click.stop="handleClose"
            >
              <er-icon icon="xmark" />
            </button>
          </div>
          <div class="er-message-box__content">
            <er-icon
              v-if="iconComponent && !state.center && hasMessage"
              :class="{
                [`er-icon-${state.type}`]: state.type,
              }"
              :icon="iconComponent"
            />
            <div v-if="hasMessage" class="er-message-box__message">
              <slot>
                <component
                  :is="state.showInput ? 'label' : 'p'"
                  :for="state.showInput ? inputId : void 0"
                >
                  {{ state.message }}
                </component>
              </slot>
            </div>
          </div>
          <div v-show="state.showInput" class="er-message-box__input">
            <er-input
              v-model="state.inputValue"
              ref="inputRef"
              :placeholder="state.inputPlaceholder"
              :type="state.inputType"
              @keyup.enter="handleInputEnter"
            />
          </div>
          <div class="er-message-box__footer">
            <er-button
              v-if="state.showCancelButton"
              class="er-message-box__footer-btn er-message-box__cancel-btn"
              :type="state.cancelButtonType"
              :round="state.roundButton"
              :loading="state.cancelButtonLoading"
              @click="handleAction('cancel')"
              @keydown.prevent.enter="handleAction('cancel')"
              >{{ state.cancelButtonText }}</er-button
            >
            <er-button
              v-show="state.showConfirmButton"
              class="er-message-box__footer-btn er-message-box__confirm-btn"
              :type="state.confirmButtonType ?? 'primary'"
              :round="state.roundButton"
              :loading="state.confirmButtonLoading"
              @click="handleAction('confirm')"
              @keydown.prevent.enter="handleAction('confirm')"
              >{{ state.confirmButtonText }}</er-button
            >
          </div>
        </div>
      </div>
    </er-overlay>
  </transition>
</template>

<style scoped>
@import "./style.css";
</style>
