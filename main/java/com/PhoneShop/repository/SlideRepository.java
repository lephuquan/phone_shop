package com.PhoneShop.repository;

import com.PhoneShop.entity.ProductEntity;
import com.PhoneShop.entity.RoleEntity;
import com.PhoneShop.entity.SlideEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SlideRepository extends JpaRepository<SlideEntity, Integer> {

    @Query("SELECT s FROM SlideEntity s")
    public List<SlideEntity> findMainSlide();


}
