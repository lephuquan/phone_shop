package com.PhoneShop.service;

import com.PhoneShop.entity.SlideEntity;
import com.PhoneShop.model.Productphoto;
import com.PhoneShop.model.Slide;
import com.PhoneShop.repository.SlideRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SlideService {

    @Autowired
    private SlideRepository slideRepository;

    public List<SlideEntity> findMainSlide(){
        List<SlideEntity> slideEntityList = slideRepository.findMainSlide();
        return new ModelMapper().map(slideEntityList, new TypeToken<List<Slide>>() {}.getType());
    }

}
