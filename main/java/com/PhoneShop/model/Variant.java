package com.PhoneShop.model;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class Variant {
    private Integer id;
    private String name;
    private String category;
    private Double price;
    private Promotion promotion;
}
