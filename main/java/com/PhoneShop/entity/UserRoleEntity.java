package com.PhoneShop.entity;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author Admin
 */
@Entity
@Table(name = "user_role")
@Getter
@Setter
@XmlRootElement
@NamedQueries({
//    @NamedQuery(name = "ProductEntity.findAll", query = "SELECT p FROM ProductEntity p")
    @NamedQuery(name = "UserRoleEntity.findByUsername", query = "SELECT p FROM UserRoleEntity p WHERE p.userEntity.username = :username")
})
public class UserRoleEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private RoleEntity roleEntity;

}
