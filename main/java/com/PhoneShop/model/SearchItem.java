package com.PhoneShop.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SearchItem {
    private String photo;
    private String name;
    private String link;
    private Double price;
}
