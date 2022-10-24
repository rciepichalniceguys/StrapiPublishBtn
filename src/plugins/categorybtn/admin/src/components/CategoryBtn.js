import React, { useState, useEffect, useRef } from "react";
import { Button } from "@strapi/design-system/Button";
import SelectBox from "./SelectBox";
import { Typography } from "@strapi/design-system/Typography";
import { Popover } from "@strapi/design-system/Popover";
import {
  ModalLayout,
  ModalBody,
  ModalHeader,
} from "@strapi/design-system/ModalLayout";
import { Alert } from "@strapi/design-system/Alert";
import { request } from "@strapi/helper-plugin";
import { useLocalStorage } from "../utils/hooks";
import "./styles.css";

const token =
  "ba293866d7190b03574ad419b18e66620d88a9da39085fb75794826f56eef68b5d8e3a79daadacdb845321b419a9866150bb61802fee9c81e0154eff280ac18d37466a2fb968c506c7f009c40843937f8d60dc96eda2885cc9be04a3df6ea564d35d0fc9f020a05cae3209d39a3f7e0edae921c3937194971038b04495ccd84d";

const CategoryBtn = () => {
  const [openChoicesPopover, setOpenChoicesPopover] = useState(false);
  const [categories, setCategories] = useState([]);
  const [checkedIDs, setCheckedIDs] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useLocalStorage(
    "isCategoryPopupVisible",
    false
  );
  const [responseStatus, setResponseStatus] = useLocalStorage(
    "categoryResponseStatus",
    null
  );

  const [isCategoriesUpdated, setIsCategoriesUpdated] = useState({
    show: false,
    status: 500,
  });

  const buttonRef = useRef(null);
  // Determine visibility of Change Category
  const contentName = window.location.pathname
    .match(/api::[a-z\-]*.[a-z\-]*/g)[0]
    .includes("article");
  if (!contentName) {
    return <div></div>;
  }
  //
  const getCheckedIDs = (e) => {
    const ids = [];
    if (e.target.getAttribute("aria-label") === "Select all entries") {
      if (!e.target.checked) {
        setCheckedIDs([]);
        return;
      }
      document.querySelectorAll('input[type="checkbox"]').forEach((c) => {
        const elements = c.parentElement.parentElement.querySelectorAll(
          'td[aria-colindex="2"] > span'
        );
        if (elements.length > 0) ids.push(elements[0].textContent);
      });
      setCheckedIDs(ids);
      return;
    }
    document.querySelectorAll('input[type="checkbox"]:checked').forEach((c) => {
      const elements = c.parentElement.parentElement.querySelectorAll(
        'td[aria-colindex="2"] > span'
      );
      if (elements.length > 0) ids.push(elements[0].textContent);
    });
    setCheckedIDs(ids);
  };

  useEffect(() => {
    if (!contentName) return;
    const getCategories = async () => {
      const res = await request(`/api/categories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const categoriesList = res.data;
      setCategories(categoriesList);
    };
    getCategories();
    document.addEventListener("click", getCheckedIDs, true);
    return () => document.removeEventListener("click", getCheckedIDs);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsPopupVisible(false);
      setResponseStatus(null);
    }, 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, [isPopupVisible]);

  return (
    <>
      {isPopupVisible && (
        <Popover source={buttonRef} spacing={10} placement={"top"} padding={2}>
          <h2
            style={{
              color: responseStatus === 200 ? "#C6F0C2" : "#F5C0B8",
            }}
          >
            {responseStatus === 200
              ? "Categories updated."
              : "Some problem occured."}
          </h2>
        </Popover>
      )}

      <Button
        variant="secondary"
        onClick={() => setOpenChoicesPopover(true)}
        disabled={checkedIDs.length > 0 ? false : true}
        ref={buttonRef}
      >
        Change category
      </Button>
      {openChoicesPopover && (
        <ModalLayout
          onClose={() => setOpenChoicesPopover((prev) => !prev)}
          labelledBy="title"
          className={`categoryModal`}
        >
          <ModalHeader>
            <Typography
              fontWeight="bold"
              textColor="neutral800"
              as="h2"
              id="title"
            >
              Choose a category:
            </Typography>
          </ModalHeader>
          <ModalBody>
            <SelectBox
              categories={categories}
              ids={checkedIDs}
              setOpenChoicesPopover={setOpenChoicesPopover}
              setIsPopupVisible={setIsPopupVisible}
              setResponseStatus={setResponseStatus}
            />
          </ModalBody>
        </ModalLayout>
      )}
    </>
  );
};

export default CategoryBtn;

//https://forum.strapi.io/t/how-to-update-single-component-in-user/2685/4 ?
