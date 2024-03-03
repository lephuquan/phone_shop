package com.PhoneShop.repository;

import com.PhoneShop.entity.RoleEntity;
import com.PhoneShop.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

    public interface RoleRepository extends JpaRepository<RoleEntity, Integer> {
        public RoleEntity findByName(String name);
}
