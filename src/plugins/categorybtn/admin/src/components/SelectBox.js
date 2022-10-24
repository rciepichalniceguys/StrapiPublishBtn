import React, { useState, useEffect } from "react";
import { Button } from "@strapi/design-system/Button";
import { Select, Option } from "@strapi/design-system/Select";
import { request } from "@strapi/helper-plugin";

const token =
  "ba293866d7190b03574ad419b18e66620d88a9da39085fb75794826f56eef68b5d8e3a79daadacdb845321b419a9866150bb61802fee9c81e0154eff280ac18d37466a2fb968c506c7f009c40843937f8d60dc96eda2885cc9be04a3df6ea564d35d0fc9f020a05cae3209d39a3f7e0edae921c3937194971038b04495ccd84d";

const SelectBox = ({
  categories,
  ids,
  setOpenChoicesPopover,
  setIsPopupVisible,
  setResponseStatus,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryTitle, setCategoryTitle] = useState(null);
  const headers = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: {
        category: selectedCategory,
      },
    }),
  };

  const updateCategory = async (id) => {
    const res = await fetch(
      `http://localhost:1337/api/articles/${id}?populate[category][populate][0]=`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            category: selectedCategory,
          },
        }),
      }
    );
    console.log(res);
    setIsPopupVisible(true);
    setResponseStatus(res.status);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ids.map((id) => {
      updateCategory(id);
    });
    setOpenChoicesPopover(false);
    location.reload();
  };

  useEffect(() => {
    const cat = categories.find(
      (category) => category.attributes.name === categoryTitle
    );
    setSelectedCategory(cat);
  }, [categoryTitle]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Select
          id="categories"
          onClear={() => setCategoryTitle("")}
          onChange={setCategoryTitle}
          value={categoryTitle}
        >
          {categories.map((category) => {
            const categoryName = category.attributes.name;
            return (
              <Option key={categoryName} value={categoryName}>
                {categoryName}
              </Option>
            );
          })}
        </Select>
        <Button
          type="submit"
          style={{ margin: "10px auto 0" }}
          disabled={!!categoryTitle ? false : true}
        >
          Submit
        </Button>
      </form>
    </>
  );
};

export default SelectBox;
