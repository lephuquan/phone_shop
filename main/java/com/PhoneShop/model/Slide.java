package com.PhoneShop.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Slide {

    private int id;
    private String photo;
    private boolean main;
    private int categoryId;
}
