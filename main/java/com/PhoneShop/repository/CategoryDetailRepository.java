package com.PhoneShop.repository;

import com.PhoneShop.entity.CategorydetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryDetailRepository extends JpaRepository<CategorydetailEntity, Integer> {

    @Query("SELECT p FROM CategorydetailEntity p WHERE p.name LIKE %:name%")
    List<CategorydetailEntity> findByNameCategory(String name);
}
