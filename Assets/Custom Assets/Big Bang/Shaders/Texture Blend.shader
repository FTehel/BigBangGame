Shader "CrossFade" {   
Properties   {     
_Blend ( "Blend", Range ( 0, 1 ) ) = 0.5     
_Color ( "Main Color", Color ) = ( 1, 1, 1, 1 )     
_Tex ( "Texture 1", 2D ) = "white" {}     
_Tex2 ( "Texture 2", 2D ) = ""   
}  
SubShader   
{     
Tags { "RenderType"="Opaque" }     
LOD 300     
Pass     {       
SetTexture[_Tex]       
SetTexture[_Tex2]       {         
ConstantColor ( 0, 0, 0, [_Blend] )         
Combine texture Lerp( constant ) previous       
}         
}        
CGPROGRAM     
#pragma surface surf Lambert 
sampler2D _Tex;     
sampler2D _Tex2;     
fixed4 _Color;     
float _Blend;          
struct Input     {       
float2 uv_Tex;       
float2 uv_Tex2;     
};          
void surf ( Input IN, inout SurfaceOutput o )     {       
fixed4 t1  = tex2D( _Tex, IN.uv_Tex ) * _Color;       
fixed4 t2  = tex2D ( _Tex2, IN.uv_Tex2 ) * _Color;       
o.Albedo  = lerp( t1, t2, _Blend );     
}     
ENDCG   
}   FallBack "Diffuse" 
} 
