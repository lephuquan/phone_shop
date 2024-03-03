package com.PhoneShop.entity;


import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@Table(name = "slide")
@Getter
@Setter
@XmlRootElement
@NamedQueries({
//    @NamedQuery(name = "SlideEntity.findMainSlide", query = "SELECT s FROM SlideEntity s WHERE s.main = true")
})
public class SlideEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Column(name = "photo")
    private String photo;

    @Column(name = "main")
    private boolean main;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private CategoryEntity categoryEntity;

    public SlideEntity(){}
    public  SlideEntity(Integer id){this.id = id;}
}