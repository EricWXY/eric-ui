import { describe, test, expect } from "vitest";
import { nextTick } from "vue";
import { notification, closeAll } from "./methods";

export const rAF = async () => {
  return new Promise((res) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(async () => {
        res(null);
        await nextTick();
      });
    });
  });
};

function getTopValue(element: Element) {
  const styles = window.getComputedStyle(element);
  const topValue = styles.getPropertyValue("top");
  return Number.parseFloat(topValue);
}

describe("createMessage", () => {
  test("call notification()", async () => {
    const handler = notification({ message: "hello msg", duration: 0 });
    await rAF();
    expect(document.querySelector(".er-notification")).toBeTruthy();
    handler.close();
    await rAF();
    expect(document.querySelector(".er-notification")).toBeFalsy();
  });

  test('call notification() more times',async()=> {
    notification({ message: "hello msg", duration: 0 });
    notification({ message: "hello msg", duration: 0 });
    await rAF();
    expect(document.querySelectorAll(".er-notification").length).toBe(2);
    notification.closeAll()
    await rAF();
    expect(document.querySelectorAll(".er-notification").length).toBe(0);
  })

  test('offset',async()=>{
    notification({ message: "hello msg", duration: 0,offset:100 });
    notification({ message: "hello msg", duration: 0,offset:50 });
    await rAF()
    const elements = document.querySelectorAll(".er-notification")
    expect(elements.length).toBe(2)

    expect(getTopValue(elements[0])).toBe(100)
    expect(getTopValue(elements[1])).toBe(150)
  })
});
