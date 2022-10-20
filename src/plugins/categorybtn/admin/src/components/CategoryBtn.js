import React, { useState, useEffect, useRef } from "react";
import { Button } from "@strapi/design-system/Button";
import SelectBox from "./SelectBox";
import { Typography } from "@strapi/design-system/Typography";
import {
  ModalLayout,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@strapi/design-system/ModalLayout";
import { Alert } from "@strapi/design-system/Alert";
import "./styles.css";

const URL = "http://localhost:1337/api/categories";
const token =
  "ba293866d7190b03574ad419b18e66620d88a9da39085fb75794826f56eef68b5d8e3a79daadacdb845321b419a9866150bb61802fee9c81e0154eff280ac18d37466a2fb968c506c7f009c40843937f8d60dc96eda2885cc9be04a3df6ea564d35d0fc9f020a05cae3209d39a3f7e0edae921c3937194971038b04495ccd84d";

const CategoryBtn = () => {
  const [openChoicesPopover, setOpenChoicesPopover] = useState(false);
  const [categories, setCategories] = useState([]);
  const [checkedIDs, setCheckedIDs] = useState([]);
  // const [checkedCount, setCheckedCount] = useState(0);
  const [isCategoriesUpdated, setIsCategoriesUpdated] = useState({
    show: false,
    status: 500,
  });

  const buttonRef = useRef(null);

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
    const getCategories = async () => {
      const res = await fetch(URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const categoriesList = data.data;
      setCategories(categoriesList);
    };
    getCategories();
    document.addEventListener("click", getCheckedIDs, true);
    // document.addEventListener("click", checkFunc, true);
    return () => window.removeEventListener("click", getCheckedIDs);
  }, []);

  useEffect(() => {
    if (isCategoriesUpdated.status >= 200 && isCategoriesUpdated.status < 300) {
      location.reload();
    }
  }, [isCategoriesUpdated.status]);

  return (
    <>
      {isCategoriesUpdated.show &&
        (isCategoriesUpdated.status >= 200 &&
        isCategoriesUpdated.status < 300 ? (
          <Alert
            closeLabel="Categories updated."
            onClose={() => setIsCategoriesUpdated(false)}
            variant="success"
            style={{}}
          >
            Categories updated. (Status: {isCategoriesUpdated.status})
          </Alert>
        ) : (
          <Alert
            closeLabel="Some problem occured."
            onClose={() => setIsCategoriesUpdated(false)}
            variant="danger"
            style={{}}
          >
            Some problem occured. Status: {isCategoriesUpdated.status}
          </Alert>
        ))}
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
              setIsCategoriesUpdated={setIsCategoriesUpdated}
            />
          </ModalBody>
        </ModalLayout>
      )}
    </>
  );
};

export default CategoryBtn;

//https://forum.strapi.io/t/how-to-update-single-component-in-user/2685/4 ?
